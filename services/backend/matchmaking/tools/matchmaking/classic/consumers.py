import json
from json.decoder import JSONDecodeError
from channels.generic.websocket import WebsocketConsumer
from django.shortcuts import get_object_or_404
import logging
from .models import WaitingModel
from .serializers import WaitingModelSerializer

logger = logging.getLogger(__name__)

pokemon_queue = []
pong_queue = []

class QueueConsumer(WebsocketConsumer):

    serializer_class = WaitingModelSerializer

    def connect(self):
        self.accept()
        logger.info('Connected')
        self.send(json.dumps({'connected': True}))


    def disconnect(self, close_code):
        logger.info('Disconnected')
        try:
            userexist = get_object_or_404(WaitingModel, userID=self.id)
            if userexist and userexist.status == 'searching':
                if userexist.game == 'pkm_multiplayer':
                    pokemon_queue.remove(userexist)
                if userexist.game == 'pong_multiplayer':
                    pong_queue.remove(userexist)
                userexist.delete()
                logger.info('User removed from queue')
        except Exception as e:
            pass


    def receive(self, text_data):
        try:
            text_data_json = json.loads(text_data)
            action = text_data_json['action']
            if action == 'queue_add':
                self.join(text_data_json)
            elif action == 'queue_status':
                self.check_queue()
                self.status(text_data_json)

        except Exception:
            pass

    def join(self, data):
        if data['game'] == 'Pong Versus':
            data['game'] = 'pong_multiplayer'
        elif data['game'] == 'Pokemon Versus':
            data['game'] = 'pkm_multiplayer'
        new_data = {
            'userID': data['id'],
            'game': data['game'],
            'status': 'searching',
            'waitingTime': 0,
            'player1': 0,
            'player2': 0   
        }
        try:
            userexist = get_object_or_404(WaitingModel, userID=data['id'])
            if userexist:
                logger.info('User found')
                if userexist.status == 'found':
                    serializer = self.serializer_class(userexist)
                    self.send(json.dumps(serializer.data))
                    return
                elif userexist.status == 'searching':
                    logger.info('User already in queue')
                    if userexist.game == 'pkm_multiplayer':
                        pokemon_queue.remove(userexist)
                    elif userexist.game == 'pong_multiplayer':
                        pong_queue.remove(userexist)
                    userexist.delete()
                    logger.info('User removed from queue')
        except Exception as e:
            pass
        try:
            serializer = self.serializer_class(data=new_data)
            if serializer.is_valid():
                instance = serializer.save()
                self.id = instance.userID
                if instance.game == 'pkm_multiplayer':
                    pokemon_queue.append(instance)
                elif instance.game == 'pong_multiplayer':
                    pong_queue.append(instance)
                serializer = self.serializer_class(instance)
                json_data = json.dumps(serializer.data)
                self.send(json_data)
        except Exception as e:
            logger.info(e)

    def status(self, data):
        instance = get_object_or_404(WaitingModel, userID=data['id'])
        serializer = self.serializer_class(instance)
        json_data = json.dumps(serializer.data)
        self.send(json_data)

    def check_queue(self):
        if len(pokemon_queue) >= 2:
            self.match(pokemon_queue)
        if len(pong_queue) >= 2:
            self.match(pong_queue)

    def match(self, queue):
        player1 = queue.pop(0)
        player2 = queue.pop(0)

        player1.status = 'found'
        player1.player1 = player1.userID
        player1.player2 = player2.userID

        player2.status = 'found'
        player2.player1 = player1.userID
        player2.player2 = player2.userID

        player1.save()
        player2.save()