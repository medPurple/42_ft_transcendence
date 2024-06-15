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
from .models import GameMatch, GameSettings, GameUser
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
        self.actual_match = 0
        self.tournament = Tournament()

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
        # await self.tournamentLoop()
        await self.findTournamentGame(0, self.user1, self.user2)

    async def disconnect(self, close_code):
        # tournaments.remove(self.tournament)
        if (self.actual_match != 0):
            self.actual_match.status = iv.PAUSED
            self.actual_match.players_nb -= 1
            self.actual_match.pauseTimer = time.time()
        await self.channel_layer.group_discard(self.group_name, self.channel_name)

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
        # logger.info("Depuis le tournoi je vais envoyer au websocket")
        await self.send(text_data=json.dumps(event["game_state"]))

    # la
    async def findTournamentGame(self, gameNbr, player1, player2):
        self.tournament.games[gameNbr].game_mode = "tournament"
        self.actual_match = self.tournament.games[gameNbr]
        self.tournament.games[gameNbr].group_name = self.group_name
        self.tournament.games[gameNbr].paddle1 = paddleC(1)
        self.tournament.games[gameNbr].paddle2 = paddleC(2)
        self.tournament.games[gameNbr].limitScore = await sync_to_async(lambda: GameSettings.objects.get(user=self.user_id).score)()
        self.tournament.games[gameNbr].shouldHandlePowerUp = await sync_to_async(lambda: GameSettings.objects.get(user=self.user_id).powerups)()
        self.tournament.games[gameNbr].players_nb = 2
        self.tournament.games[gameNbr].player1_user_name = player1
        self.tournament.games[gameNbr].player2_user_name = player2
        self.tournament.games[gameNbr].player1_user_id = self.user_id
        self.tournament.games[gameNbr].gameNbr = gameNbr
        await self.send(text_data=json.dumps({"party": "active"}))
        self.tournament.games[gameNbr].powerUpTimer = time.time()
        self.tournament.games[gameNbr].status = iv.WAITING_FOR_VALIDATION
        asyncio.create_task(self.tournament.games[gameNbr].run_game_loop())
        return self.tournament.games[gameNbr]

    async def receive(self, text_data):
        text_data_json = json.loads(text_data)

        for key in text_data_json:
            if (key == "paddleMov1"):
                with self.actual_match._lock:
                    self.actual_match.paddle1.move = text_data_json["paddleMov1"]

            if (key == "paddleMov2"):
                with self.actual_match._lock:
                    self.actual_match.paddle2.move = text_data_json["paddleMov2"]

            if (key == "validate"):
                with self.actual_match._lock:
                    self.actual_match.players_ready += 1


    # la
    async def load_game(self,event):
        # Récupérer les données du jeu
        game_data = event["load_game"]

        # Récupérer les scores des joueurs
        player1_score = game_data["player1Score"]
        player2_score = game_data["player2Score"]
        gameNbr = game_data["gameNbr"]
        if (gameNbr == 0):
            if (player1_score > player2_score):
                self.winner1 = self.user1
            else:
                self.winner1 = self.user2
            await self.findTournamentGame(1, self.user3, self.user4)
        elif (gameNbr == 1):
            if (player1_score > player2_score):
                self.winner2 = self.user3
            else:
                self.winner2 = self.user4
            await self.findTournamentGame(2, self.winner1, self.winner2)

class PongLocalConsumer(AsyncWebsocketConsumer):

    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)
        self.gameState = 0
        self.user_id = 0
#################
        self.gameUser = 0
#################

    async def connect(self):
        self.user_id = self.scope["url_route"]["kwargs"]["user_id"]
        self.user_name = self.scope["url_route"]["kwargs"]["user1"]
        self.player2_name = self.scope["url_route"]["kwargs"]["user2"]
        await self.accept()
        self.gameState = await self.findLocalParty()

    async def disconnect(self, close_code):
        if (self.gameState != 0):
            self.gameState.status = iv.PAUSED
            self.gameState.players_nb -= 1
            self.gameState.pauseTimer = time.time()
        await self.channel_layer.group_discard(self.gameState.group_name, self.channel_name)

    async def findLocalParty(self):
        global local_parties
#################
        self.gameUser = await sync_to_async(lambda: GameUser.objects.get(userID=self.user_id))()
#################
        self.gameState = gameStateC()
        local_parties.append(self.gameState)
        self.gameState.game_mode = "local"
        self.gameState.group_name = await self.generate_local_name()
        self.gameState.player1_user_id = self.user_id
        self.gameState.player1_user_name = self.user_name
        self.gameState.player2_user_name = self.player2_name
        self.gameState.players_nb = 2
        await self.channel_layer.group_add(self.gameState.group_name, self.channel_name)
        self.gameState.paddle1 = paddleC(1)
        self.gameState.paddle2 = paddleC(2)
#################
        self.gameState.limitScore = await sync_to_async(lambda: GameSettings.objects.get(user=self.gameUser).score)()
        #logger.info("Player1 limitScore %d", self.gameState.limitScore)
        self.gameState.shouldHandlePowerUp = await sync_to_async(lambda: GameSettings.objects.get(user=self.gameUser).powerups)()
        #logger.info("Player1 powerups %d", self.gameState.shouldHandlePowerUp)
#################
        await self.send(text_data=json.dumps({"party": "active"})) 
        self.gameState.powerUpTimer = time.time()
        self.gameState.status = iv.WAITING_FOR_VALIDATION
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
            if (key == "validate"):
                with self.gameState._lock:
                    self.gameState.players_ready += 1

    async def game_state(self,event):
        #logger.info("Depuis le local je vais envoyer au websocket")
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
        self.user_name = 0
        self.gameState = 0
#################
        self.gameUser = 0
        self.user_id = 0
#################

    async def connect(self):
        self.user_id = self.scope["url_route"]["kwargs"]["user_id"]
        self.user_name = self.scope["url_route"]["kwargs"]["user_name"]
        if await self.checkForReconnexion():
            await self.accept()
            logger.info("%s Je cherche a me reconnecter", self.user_name)
            self.gameState = await self.rejoinRemoteParty()
            self.gameState.players_nb += 1
            if (self.gameState.players_nb == 2):
                self.gameState.status = iv.RUNNING
        else :
            await self.accept()
            logger.info("%s Je cherche a creer/joindre une partie", self.user_name)
            await self.findRemoteParty()


    async def disconnect(self, close_code):

        if (self.gameState != 0):
            self.gameState.status = iv.PAUSED
            self.gameState.players_nb -= 1
            self.gameState.pauseTimer = time.time()
            logger.info("%d je ferme un socket", self.gameState.status)
        await self.channel_layer.group_discard(self.gameState.group_name, self.channel_name)

    async def receive(self, text_data):
        text_data_json = json.loads(text_data)

        for key in text_data_json:
            if (key == "paddleMov"):
                if (self.player_id == 1):
                    with self.gameState._lock:
                        self.gameState.paddle1.move = text_data_json["paddleMov"]
                else:
                    with self.gameState._lock:
                        self.gameState.paddle2.move = text_data_json["paddleMov"]
            if (key == "validate"):
                with self.gameState._lock:
                    self.gameState.players_ready += 1

    async def findRemoteParty(self):
        global remote_parties
        listLen = len(remote_parties)
        logger.info("listLen : %d", listLen)
        if (listLen == 0 or remote_parties[listLen - 1].players_nb == 2 or 
            (remote_parties[listLen - 1].status == iv.PAUSED and remote_parties[listLen-1].players_nb == 2)):
            logger.info("1 Je cree la partie")
            newPart = gameStateC()
            remote_parties.append(newPart)
            self.player_id = 1
            await self.send(text_data=json.dumps({"player": self.player_id}))
            self.gameState = newPart
            with self.gameState._lock:
                self.gameState.players_nb = 1
                self.gameState.game_mode = "remote"
                self.gameState.group_name = await self.generate_group_name()
#################
                self.gameUser = await sync_to_async(lambda: GameUser.objects.get(userID=self.user_id))()
                self.gameState.limitScore = await sync_to_async(lambda: GameSettings.objects.get(user=self.gameUser).score)()
                #logger.info("Player1 limitScore %d", self.gameState.limitScore)
                self.gameState.shouldHandlePowerUp = await sync_to_async(lambda: GameSettings.objects.get(user=self.gameUser).powerups)()
#################
                #logger.info("Player1 powerups %d", self.gameState.shouldHandlePowerUp)
                self.gameState.player1_user_id = self.user_id
                self.gameState.player1_user_name = self.user_name 
            await self.channel_layer.group_add(self.gameState.group_name, self.channel_name)
            return newPart
        else:
            logger.info("2 Je join la partie")
            self.player_id = 2 
            await self.send(text_data=json.dumps({"player": self.player_id}))
            self.gameState = remote_parties[listLen - 1]
            with self.gameState._lock:
                await self.channel_layer.group_add(self.gameState.group_name, self.channel_name)
                self.gameState.player2_user_id = self.user_id 
                self.gameState.player2_user_name = self.user_name 
                self.gameState.players_nb = 2
                self.gameState.powerUpTimer = time.time()
                self.gameState.pauseTimer = time.time()
                self.gameState.status = iv.WAITING_FOR_VALIDATION
                logger.info("Je vais lancer la tache asynchrone")
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
