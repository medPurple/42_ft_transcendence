import json

from channels.generic.websocket import AsyncWebsocketConsumer
from pongapp.game_classes import paddleC ballC gameState

parties = [];
group_members = 0

class PongConsumer(AsyncWebsocketConsumer):

    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)
        self.player_id = 0
        self.gameState;
        self.paddle = paddleC();

    async def connect(self):
        self.gameState = findParty();
        await self.channel_layer.group_add("test", self.channel_name)
        await self.accept()
        await self.send(text_data=json.dumps({"player": self.player_id}))

    async def disconnect(self, close_code):
        await self.channel_layer.group_discard("test", self.channel_name)

    async def receive(self, text_data):
        text_data_json = json.loads(text_data)
        paddleMov = text_data_json["paddleMov"]

        if (self.player_id == 1):
            #await self.send(text_data=json.dumps({"paddleMov1": paddleMov}))
            await self.channel_layer.group_send("test", {"type": "paddle.message", "paddleMov1": paddleMov})
        else:
            await self.channel_layer.group_send("test", {"type": "paddle.message", "paddleMov2": paddleMov})
            #await self.send(text_data=json.dumps({"paddleMov2": paddleMov}))

    async def paddle_message(self, event):
        if(self.player_id == 1 and "paddleMov2" in event):
            paddleMov = event["paddleMov2"];
            await self.send(text_data=json.dumps({"paddleMov2": paddleMov}))
        elif(self.player_id == 2 and "paddleMov1" in event):
            paddleMov = event["paddleMov1"];
            await self.send(text_data=json.dumps({"paddleMov1": paddleMov}))

    def findParty(self):
        global parties
        listLen = len(parties)
        if (!listLength or parties[listLen - 1].players_nb == 2):
            newPart = gameState()
            parties.append(newPart)


