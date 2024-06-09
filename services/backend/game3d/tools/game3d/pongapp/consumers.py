import json
import random
import string
import logging
import time
import asyncio
import threading
from . import initvalues

from django.db.models import Q
from channels.generic.websocket import AsyncWebsocketConsumer
from pongapp.game_classes import paddleC, ballC, gameStateC, remote_parties, local_parties, tournaments, Tournament
from . import initvalues as iv
from .models import GameMatch
from .serializers import GameMatchSerializer
from asgiref.sync import async_to_sync, sync_to_async

logger = logging.getLogger(__name__)
# remote_parties = []
# local_parties = []
group_names = []
group_members = 0

class PongTournamentConsumer(AsyncWebsocketConsumer):

    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)
        self.group_name = 0

    async def connect(self):
        self.user_id = self.scope["url_route"]["kwargs"]["user_id"]
        self.user1 = self.scope["url_route"]["kwargs"]["user1"]
        self.user2 = self.scope["url_route"]["kwargs"]["user2"]
        self.user3 = self.scope["url_route"]["kwargs"]["user3"]
        self.user4 = self.scope["url_route"]["kwargs"]["user4"]
        self.players = [self.user1, self.user2, self.user3, self.user4]
        await self.accept()
        self.group_name = await self.generate_tournament_name()
        logger.info("Group Name consumer : %s", self.group_name)
        await self.channel_layer.group_add(self.group_name, self.channel_name)
        await self.tournamentLoop()

    async def disconnect(self, close_code):
        tournaments.remove(self.tournament)
        await self.channel_layer.group_discard(self.group_name, self.channel_name)

    async def tournamentLoop(self):
        global tournaments
        self.tournament = Tournament(players = self.players, group_name=self.group_name, user_id=self.user_id)
        tournaments.append(self.tournament)
        await self.send(text_data=json.dumps({"party": "active"})) 
        await self.tournament.tournamentLoop()

    async def generate_tournament_name(self, length=8):
        global group_names
        characters = string.ascii_letters + string.digits
        group_name = ''.join(random.choice(characters) for _ in range(length))
        if (group_name in group_names):
            await self.generate_tournament_name()
        else:
            group_names.append(group_name)
            return group_name

    async def game_state(self,event):
        await self.send(text_data=json.dumps(event["game_state"]))

class PongLocalConsumer(AsyncWebsocketConsumer):

    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)
        self.gameState = 0

    async def connect(self):
        await self.accept()
        self.gameState = await self.findLocalParty()

    async def disconnect(self, close_code):
        await self.channel_layer.group_discard(self.gameState.group_name, self.channel_name)

    async def findLocalParty(self):
        global local_parties
        self.gameState = gameStateC()
        local_parties.append(self.gameState)
        self.gameState.game_mode = "local"
        self.gameState.group_name = await self.generate_local_name()
        await self.channel_layer.group_add(self.gameState.group_name, self.channel_name)
        self.gameState.paddle1 = paddleC(1)
        self.gameState.paddle2 = paddleC(2)
        self.gameState.players_nb = 2
        await self.send(text_data=json.dumps({"party": "active"})) 
        self.gameState.powerUpTimer = time.time()
        asyncio.create_task(self.gameState.run_game_loop())
        return self.gameState

    async def receive(self, text_data):
        text_data_json = json.loads(text_data)

        for key in text_data_json:
            if (key == "paddleMov1"):
                with self.gameState._lock:
                    self.gameState.paddle1.move = text_data_json["paddleMov1"]

            if (key == "paddleMov2"):
                with self.gameState._lock:
                    self.gameState.paddle2.move = text_data_json["paddleMov2"]

    async def game_state(self,event):
        await self.send(text_data=json.dumps(event["game_state"]))
     
    async def generate_local_name(self, length=8):
        global group_names
        characters = string.ascii_letters + string.digits
        group_name = ''.join(random.choice(characters) for _ in range(length))
        if (group_name in group_names):
            generate_local_name()
        else:
            group_names.append(group_name)
            return group_name


class PongRemoteConsumer(AsyncWebsocketConsumer):

    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)
        self.player_id = 0
        self.user_id = 0
        self.user_name = 0
        self.gameState = 0

    async def connect(self):
        self.user_id = self.scope["url_route"]["kwargs"]["user_id"]
        self.user_name = self.scope["url_route"]["kwargs"]["user_name"]
        if await self.checkForReconnexion():
            await self.accept()
            logger.info("%s Je cherche a me reconnecter", self.user_name)
            self.gameState = await self.rejoinRemoteParty()
            self.gameState.status = iv.RUNNING
        else :
            await self.accept()
            logger.info("%s Je cherche a creer/joindre une partie", self.user_name)
            await self.findRemoteParty()


    async def disconnect(self, close_code):

        if (self.gameState != 0):
            self.gameState.status = iv.PAUSED
            #self.gameState.players_nb -= 1
            logger.info("%d je ferme un socket", self.gameState.status)
        await self.channel_layer.group_discard(self.gameState.group_name, self.channel_name)

    async def receive(self, text_data):
        text_data_json = json.loads(text_data)
        paddleMov = text_data_json["paddleMov"]
        if (self.player_id == 1):
            with self.gameState._lock:
                self.gameState.paddle1.move = paddleMov
        else:
            with self.gameState._lock:
                self.gameState.paddle2.move = paddleMov 

    async def findRemoteParty(self):
        global remote_parties
        listLen = len(remote_parties)
        if (listLen == 0 or remote_parties[listLen - 1].players_nb == 2 or 
            (remote_parties[listLen - 1].status == iv.PAUSED and remote_parties[listLen-1].players_nb == 2)):
            newPart = gameStateC()
            remote_parties.append(newPart)
            self.player_id = 1
            await self.send(text_data=json.dumps({"player": self.player_id}))
            self.gameState = newPart
            self.gameState.game_mode = "remote"
            self.gameState.group_name = await self.generate_group_name()
            remote_parties[listLen].players_nb = 1
            self.gameState.player1_user_id = self.user_id 
            await self.channel_layer.group_add(self.gameState.group_name, self.channel_name)
            return newPart
        else:
            self.player_id = 2 
            await self.send(text_data=json.dumps({"player": self.player_id}))
            self.gameState = remote_parties[listLen - 1]
            await self.channel_layer.group_add(self.gameState.group_name, self.channel_name)
            self.gameState.player2_user_id = self.user_id 
            self.gameState.players_nb = 2
            self.gameState.powerUpTimer = time.time()
            self.gameState.pauseTimer = time.time()
            await self.channel_layer.group_send(self.gameState.group_name, {"type": "launch.party"})
            self.task = asyncio.create_task(self.gameState.run_game_loop())
            return remote_parties[listLen - 1]

    async def checkForReconnexion(self):
        global remote_parties
        for party in remote_parties:
            if (party.status == iv.PAUSED):
                if (party.player1_user_id == self.user_id or party.player2_user_id == self.user_id):
                    return True
        return False

    async def game_state(self,event):
        await self.send(text_data=json.dumps(event["game_state"]))

    async def rejoinRemoteParty(self):
        global remote_parties
        for party in remote_parties:
            if (party.status == iv.PAUSED):
                if (party.player1_user_id == self.user_id or party.player2_user_id == self.user_id):
                    await self.channel_layer.group_add(party.group_name, self.channel_name)
                    await self.send(text_data=json.dumps({"party": "active"}))
                    if (party.player1_user_id == self.user_id):
                        self.player_id = 1
                        await self.send(text_data=json.dumps({"player": self.player_id}))
                    else:
                        self.player_id = 2
                        await self.send(text_data=json.dumps({"player": self.player_id}))
                    return party
        return remote_parties[0]

    async def launch_party(self, event):
        await self.send(text_data=json.dumps({"party": "active"}))
    #
    # async def createPartyObject(self, match_object):
    #     global remote_parties
    #     logger.info("Un objet de jeu est cree")
    #     newPart = gameStateC()
    #     newPart.game_mode = "remote"
    #     player1Id = await sync_to_async(lambda: match_object.player1.userID)()
    #     player2Id = await sync_to_async(lambda: match_object.player2.userID)()
    #     newPart.player1_user_id =  str(player1Id)
    #     newPart.player2_user_id =  str(player2Id)
    #     newPart.group_name = await self.generate_group_name()
    #     newPart.powerUpTimer = time.time()
    #     await self.logObject(newPart)
    #     remote_parties.append(newPart)
    #
    # async def IamInPartyObject(self):
    #     global remote_parties
    #     for party in remote_parties:
    #         if (self.user_id == party.player1_user_id or self.user_id == party.player2_user_id):
    #             logger.info("Je suis dans un objet de party")
    #             return True 
    #     return False
    #
    # async def findMyParty(self):
    #     global remote_parties
    #     for party in remote_parties:
    #         if (self.user_id == party.player1_user_id or self.user_id == party.player2_user_id):
    #             logger.info("Je return une party")
    #             return party 
    #     return party
    #
    # async def joinRemoteParty(self):
    #     logger.info("Je cherche a rejoindre un party")
    #     while not await self.IamInPartyObject():
    #         logger.info("Je boucle infini")
    #         await asyncio.sleep(0.016)
    #     self.gameState = await self.findMyParty()
    #     await self.channel_layer.group_add(self.gameState.group_name, self.channel_name)
    #     await self.send(text_data=json.dumps({"player": self.player_id}))
    #     logger.info("Je vais rajouter un joueur")
    #     with self.gameState._lock:
    #         self.gameState.players_nb += 1 
    #         if (self.gameState.players_nb == 2):
    #             self.gameState.powerUpTimer = time.time()
    #             await self.channel_layer.group_send(self.gameState.group_name, {"type": "launch.party"})
    #             logger.info("Party will be launched")
    #             asyncio.create_task(self.gameState.run_game_loop())
    #
    #
    # def get_filtered_matches(self):
    #     return list(GameMatch.objects.filter(Q(status=0) & (Q(player1=self.user_id) | Q(player2=self.user_id))))
    #
    # async def find_player_id(self):
    #     match_models = await sync_to_async(self.get_filtered_matches)()
    #     player1Id = await sync_to_async(lambda: match_models[0].player1.userID)()
    #     player2Id = await sync_to_async(lambda: match_models[0].player2.userID)()
    #     if (self.user_id == str(player1Id)):
    #         await self.createPartyObject(match_models[0])
    #         return str(1)
    #     elif (self.user_id == str(player2Id)):
    #         return str(2)
    #

    # async def createRemoteParty(self):
    #     global remote_parties 
    #     listLen = len(remote_parties)
    #     newPart = gameStateC()
    #     remote_parties.append(newPart)
    #     remote_parties[listLen].paddle1 = paddleC(1)
    #     self.gameState = newPart
    #     self.gameState.player1_user_id = self.user_id
    #     self.gameState.game_mode = "remote"
    #     self.gameState.group_name = await self
    #
    # async def joinRemoteParty(self):
    #     global remote_parties
    #     listLen = len(remote_parties)
    #     remote_parties[listLen - 1].paddle2 = paddleC(2)
    #     await self.send(text_data=json.dumps({"player": self.player_id}))
    #     self.gameState = remote_parties[listLen - 1]
    #     self.gameState.player2_user_id = self.user_id
    #     self.gameState.players_nb = 2
    #     self.gameState.powerUpTimer = time.time()
    #     asyncio.create_task(self.gameState.run_game_loop())
    #     return remote_parties[listLen - 1]
    #
    async def logObject(self, gameState):
        logbuff = gameState
        logger.info("player1_user_id : %s" % (logbuff.player1_user_id))
        logger.info("player2_user_id : %s" % (logbuff.player2_user_id))
        logger.info("group_name : %s" % (logbuff.group_name))
        logger.info("players_nb : %d" % (logbuff.players_nb))
        logger.info("player1Score : %d" % (logbuff.player1Score))
        logger.info("player2Score : %d" % (logbuff.player2Score))
        logger.info("paddle1.positionX : %d" % (logbuff.paddle1.positionX))
        logger.info("paddle1.width : %d" % (logbuff.paddle1.width))
        logger.info("paddle1.dirY : %d" % (logbuff.paddle1.dirY))
        logger.info("paddle1.speed : %d" % (logbuff.paddle1.speed))
        logger.info("paddle1.move : %s" % (logbuff.paddle1.move))
        logger.info("paddle2.positionX : %d" % (logbuff.paddle2.positionX))
        logger.info("paddle2.width : %d" % (logbuff.paddle2.width))
        logger.info("paddle2.dirY : %d" % (logbuff.paddle2.dirY))
        logger.info("paddle2.speed : %d" % (logbuff.paddle2.speed))
        logger.info("paddle2.move : %s" % (logbuff.paddle2.move))
        logger.info("ball.positionX : %d" % (logbuff.ball.positionX))
        logger.info("ball.positionY : %d" % (logbuff.ball.positionY))
        logger.info("ball.dirX : %d" % (logbuff.ball.dirX))
        logger.info("ball.dirY : %d" % (logbuff.ball.dirY))
        logger.info("ball.speed : %d" % (logbuff.ball.speed))
        logger.info("active : %d" % (logbuff.status))


    async def generate_group_name(self, length=8):
        global group_names
        characters = string.ascii_letters + string.digits
        group_name = ''.join(random.choice(characters) for _ in range(length))
        if (group_name in group_names):
            generate_group_name()
        else:
            group_names.append(group_name)
            return group_name
