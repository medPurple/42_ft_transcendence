import json
import requests
from urllib.parse import parse_qs
from asgiref.sync import sync_to_async
from channels.generic.websocket import AsyncWebsocketConsumer
from .models import Message
from .serializers import MessageSerializer
import logging

logger = logging.getLogger(__name__)


class ChatConsumer(AsyncWebsocketConsumer):
    serializer_class = MessageSerializer

    async def connect(self):
        self.room_name = self.scope["url_route"]["kwargs"]["room_name"]
        self.room_group_name = f"chat_{self.room_name}"

        # ── Authentification JWT ──────────────────────────────────────────────
        query_string = self.scope['query_string'].decode()
        params = parse_qs(query_string)
        token = params.get('token', [None])[0]

        if not token:
            await self.close(code=4001)
            return

        try:
            response = requests.get(
                'https://JWToken:4430/api/token/',
                headers={'Authorization': f'Bearer {token}'}
            )
            response.raise_for_status()
            data = response.json()

            if data.get('success') is not True:
                await self.close(code=4001)
                return

            self.user_id = data.get('data', {}).get('user_id')
            if not self.user_id:
                await self.close(code=4001)
                return

        except Exception as e:
            logger.warning(f"ChatConsumer auth failed: {e}")
            await self.close(code=4001)
            return
        # ─────────────────────────────────────────────────────────────────────

        await self.channel_layer.group_add(self.room_group_name, self.channel_name)
        await self.accept()

    async def disconnect(self, close_code):
        await self.channel_layer.group_discard(self.room_group_name, self.channel_name)

    async def receive(self, text_data):
        # Parsing sécurisé — ne pas crasher sur un message mal formé
        try:
            text_data_json = json.loads(text_data)
        except json.JSONDecodeError:
            await self.send(text_data=json.dumps({'error': 'Invalid JSON'}))
            return

        message = text_data_json.get('message', '').strip()
        if not message:
            return

        # user_id vient du token authentifié — jamais du payload client
        data = {
            'user_id': self.user_id,
            'message': message,
            'room_name': self.room_name,
        }
        serializer = self.serializer_class(data=data)
        if serializer.is_valid():
            await self.save_message(serializer)
            await self.channel_layer.group_send(
                self.room_group_name, {
                    "type": "chat.message",
                    "message": message,
                    "user_id": self.user_id,
                    "time": serializer.data.get('timestamp'),
                }
            )
        else:
            await self.send(text_data=json.dumps({
                'error': 'Invalid message',
                'details': serializer.errors
            }))

    @sync_to_async
    def save_message(self, serializer):
        serializer.save()

    async def chat_message(self, event):
        await self.send(text_data=json.dumps({
            "message": event["message"],
            "user_id": event["user_id"],
            "time": event["time"],
        }))
