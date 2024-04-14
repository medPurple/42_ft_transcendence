from channels.generic.websocket import AsyncWebsocketConsumer
from urllib.parse import parse_qs
from django.contrib.auth import get_user_model
from django.shortcuts import get_object_or_404
from .models import WaitingModel
from .serializers import WaitingModelSerializer
import json

class QueueConsumer(AsyncWebsocketConsumer):
    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)
        self.send_data = True

    async def connect(self):
        self.accept()
        params = parse_qs(self.scope['query_string'].decode())
        user_id = params.get('userID')
        if user_id:
            instance = get_object_or_404(WaitingModel, userID=user)
            serializer = WaitingModelSerializer(instance)
            while self.send_data:
                await self.send(text_data=json.dumps(serializer.data))

    async def disconnect(self, close_code):
        self.send_data = False

    async def receive(self, text_data):
        text_data_json = json.loads(text_data)
        if text_data_json.get('message') == 'stop':
            self.send_data = False