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
pong_tournament_queue = []

class QueueConsumer(WebsocketConsumer):

    serializer_class = WaitingModelSerializer

    def connect(self):
        self.accept()
        logger.info('Connected')


    def disconnect(self, close_code):
        pass

    def receive(self, text_data):
        logger.info(text_data)
        try:
            text_data_json = json.loads(text_data)
            action = text_data_json['action']
            if action == 'queue_add':
                logger.info('Queue add')
                self.join(text_data_json)
            elif action == 'queue_status':
                logger.info('Queue status')
                self.check_queue()
                logger.info('Queue checked')
                self.status(text_data_json)
            elif action == 'queue_remove':
                logger.info('Queue remove')
                self.leave(text_data_json)
            elif action == 'delete_user':
                logger.info('Delete user')
                self.delete(text_data_json)
        except Exception:
            pass

    def join(self, data):
        if data['game'] == 'Pong Tournament':
            data['game'] = 'pong_tournament'
        elif data['game'] == 'Pong Versus':
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
                logger.info('User exists')
                self.leave(new_data)
        except Exception as e:
            logger.info(e)
            pass
        try:
            serializer = self.serializer_class(data=new_data)
            if serializer.is_valid():
                logger.info('Valid')
                instance = serializer.save()
                if instance.game == 'pkm_multiplayer':
                    pokemon_queue.append(instance)
                elif instance.game == 'pong_multiplayer':
                    pong_queue.append(instance)
                elif instance.game == 'pong_tournament':
                    pong_tournament_queue.append(instance)
                serializer = self.serializer_class(instance)
                json_data = json.dumps(serializer.data)
                self.send(json_data)

            logger.info('pong_tournament_queue')
            logger.info(pong_tournament_queue)
            logger.info('pong_queue')
            logger.info(pong_queue)
            logger.info('pokemon_queue')
            logger.info(pokemon_queue)

        except Exception as e:
            logger.info(e)

    def status(self, data):
        instance = get_object_or_404(WaitingModel, userID=data['id'])
        serializer = self.serializer_class(instance)
        json_data = json.dumps(serializer.data)
        self.send(json_data)

    def leave(self, data):
        instance = get_object_or_404(WaitingModel, userID=data['id'])
        if instance.game == 'pkm_multiplayer' and instance in pokemon_queue:
            pokemon_queue.remove(instance)
        elif instance.game == 'pong_multiplayer' and instance in pong_queue:
            pong_queue.remove(instance)
        elif instance.game == 'pong_tournament' and instance in pong_tournament_queue:
            pong_tournament_queue.remove(instance)
        instance.delete()

    def check_queue(self):
        logger.info('Checking pokemon queue')
        if len(pokemon_queue) >= 2:
            self.match(pokemon_queue)
        logger.info('Checking pong queue')
        if len(pong_queue) >= 2:
            self.match(pong_queue)
        logger.info('Checking pong tournament queue')
        if len(pong_tournament_queue) >= 2:
            self.match(pong_tournament_queue)

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

    def delete(self, data):
        instance = get_object_or_404(WaitingModel, userID=data['id'])
        instance.delete()