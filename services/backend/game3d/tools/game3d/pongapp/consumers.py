import json
import random
import string
import logging
import time
import asyncio
import threading
from . import initvalues

from channels.generic.websocket import AsyncWebsocketConsumer
from pongapp.game_classes import paddleC, ballC, gameStateC

logger = logging.getLogger(__name__)
remote_parties = []
local_partie = []
group_names = []
group_members = 0

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
        self.gameState = gameStateC()
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
        self.gameState = 0

    async def connect(self):
        self.user_id = self.scope["url_route"]["kwargs"]["user_id"]

        await self.accept()
        self.gameState =  await self.findRemoteParty()

    async def disconnect(self, close_code):
        self.gameState
        await self.channel_layer.group_discard(self.gameState.group_name, self.channel_name)

    async def receive(self, text_data):
        text_data_json = json.loads(text_data)

        paddleMov = text_data_json["paddleMov"]

        if (self.player_id == 1):
            with self.gameState._lock:
                #await self.testpaddle1Mov(self.gameState.paddle1, paddleMov)
                self.gameState.paddle1.move = paddleMov
            #await self.channel_layer.group_send(self.gameState.group_name, {"type": "paddle.message", "paddleMov1": paddleMov})
        else:
            with self.gameState._lock:
                #await self.testpaddle2Mov(self.gameState.paddle2, paddleMov)
                self.gameState.paddle2.move = paddleMov
            #await self.channel_layer.group_send(self.gameState.group_name, {"type": "paddle.message", "paddleMov2": paddleMov})

    async def game_state(self,event):
        await self.send(text_data=json.dumps(event["game_state"]))

    async def findRemoteParty(self):
        global remote_parties
        listLen = len(remote_parties)
        if (listLen == 0 or remote_parties[listLen - 1].players_nb == 2):
            newPart = gameStateC()
            remote_parties.append(newPart)
            remote_parties[listLen].paddle1 = paddleC(1)
            self.player_id = 1
            await self.send(text_data=json.dumps({"player": self.player_id}))
            self.gameState = newPart
            self.gameState.game_mode = "remote"
            self.gameState.group_name = await self.generate_group_name()
            remote_parties[listLen].players_nb = 1
            await self.channel_layer.group_add(self.gameState.group_name, self.channel_name)
            return newPart
        else:
            remote_parties[listLen - 1].paddle2 = paddleC(2)
            self.player_id = 2 
            await self.send(text_data=json.dumps({"player": self.player_id}))
            self.gameState = remote_parties[listLen - 1]
            self.gameState.players_nb = 2
            await self.channel_layer.group_add(self.gameState.group_name, self.channel_name)
            await self.channel_layer.group_send(self.gameState.group_name, {"type": "launch.party"})
            self.gameState.powerUpTimer = time.time()
            asyncio.create_task(self.gameState.run_game_loop())
            return remote_parties[listLen - 1]

    async def logObject(self):
        logbuff = self.gameState
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
        logger.info("active : %d" % (logbuff.active))

    async def launch_party(self, event):
        await self.send(text_data=json.dumps({"party": "active"}))

    async def generate_group_name(self, length=8):
        global group_names
        characters = string.ascii_letters + string.digits
        group_name = ''.join(random.choice(characters) for _ in range(length))
        if (group_name in group_names):
            generate_group_name()
        else:
            group_names.append(group_name)
            return group_name
