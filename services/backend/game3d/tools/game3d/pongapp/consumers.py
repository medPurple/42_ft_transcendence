import json
import logging

from channels.generic.websocket import AsyncWebsocketConsumer
from pongapp.game_classes import paddleC, ballC, gameStateC

logger = logging.getLogger(__name__)
parties = [];
group_members = 0

class PongConsumer(AsyncWebsocketConsumer):

    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)
        self.player_id = 0
        self.gameState = 0;

    async def connect(self):
        await self.accept()
        self.gameState =  await self.findParty();
        await self.send(text_data=json.dumps({"player": self.player_id}))

    async def disconnect(self, close_code):
        await self.channel_layer.group_discard("test", self.channel_name)

    async def receive(self, text_data):
        text_data_json = json.loads(text_data)
        paddleMov = text_data_json["paddleMov"]

        if (self.player_id == 1):
            #await self.send(text_data=json.dumps({"paddleMov1": paddleMov}))
            await self.channel_layer.group_send(self.gameState.group_name, {"type": "paddle.message", "paddleMov1": paddleMov})
        else:
            await self.channel_layer.group_send(self.gameState.group_name, {"type": "paddle.message", "paddleMov2": paddleMov})
            #await self.send(text_data=json.dumps({"paddleMov2": paddleMov}))

    async def paddle_message(self, event):
        if(self.player_id == 1 and "paddleMov2" in event):
            paddleMov = event["paddleMov2"];
            await self.send(text_data=json.dumps({"paddleMov2": paddleMov}))
        elif(self.player_id == 2 and "paddleMov1" in event):
            paddleMov = event["paddleMov1"];
            await self.send(text_data=json.dumps({"paddleMov1": paddleMov}))

    async def findParty(self):
        global parties
        listLen = len(parties)
        logger.debug(listLen)
        if (listLen > 0):
            logger.debug(parties[listLen - 1].players_nb)
        if (listLen == 0 or parties[listLen - 1].players_nb == 2):
            logger.debug("Je cree une nouvelle partie a l'index")
            logger.debug(listLen)
            newPart = gameStateC()
            parties.append(newPart)
            parties[listLen].paddle1 = paddleC(1);
            self.player_id = 1
            self.gameState = newPart
            if (listLen == 0):
                self.gameState.group_name = '0'
            else:
                self.gameState.group_name = str(listLen)
            parties[listLen].player_nb = 1
            await self.channel_layer.group_add(self.gameState.group_name, self.channel_name)
        else:
            parties[listLen - 1].paddle2 = paddleC(2);
            self.player_id = 2 
            self.gameState = parties[listLen - 1]
            logger.debug("Je rejoins la partie a l'index")
            logger.debug(listLen - 1)
            self.gameState.players_nb = 2
            logger.debug("cette partie contient le nb de joueurs : ")
            logger.debug(self.gameState.players_nb)
            
            await self.channel_layer.group_add(self.gameState.group_name, self.channel_name)
            await self.channel_layer.group_send(self.gameState.group_name, {"type": "launch.party"})

    async def launch_party(self, event):
        await self.send(text_data=json.dumps({"party": "active"}))




