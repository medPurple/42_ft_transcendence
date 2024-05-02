import json

# from channels.db import sync_to_async
from asgiref.sync import sync_to_async
from channels.generic.websocket import AsyncWebsocketConsumer
import logging
from .models import Message

from .serializers import MessageSerializer

logger = logging.getLogger(__name__)

class ChatConsumer(AsyncWebsocketConsumer):
	serializer_class = MessageSerializer

	async def connect(self):
		self.room_name = self.scope["url_route"]["kwargs"]["room_name"]
		self.room_group_name = f"chat_{self.room_name}"

		# Join room group
		await self.channel_layer.group_add(self.room_group_name, self.channel_name)

		await self.accept()

	async def disconnect(self, close_code):
		# Leave room group
		await self.channel_layer.group_discard(self.room_group_name, self.channel_name)

	# Receive message from WebSocket
	async def receive(self, text_data):
		text_data_json = json.loads(text_data)
		serializer = self.serializer_class(data=text_data_json)
		logger.debug(text_data_json)
		if serializer.is_valid():
			await self.save_message(serializer)
			user_id = serializer.data.get('user_id')
			message = serializer.data.get('message')
			await self.channel_layer.group_send(
				self.room_group_name, {
					"type": "chat.message",
					"message": f"{user_id}: {message}"  # Include the user id in the message
				}
			)

	@sync_to_async
	def save_message(self, serializer):
		serializer.save()

	# 	Message.objects.create(user_id=user_id, room_name=room_name, message=message)


	# Receive message from room group
	async def chat_message(self, event):
		message = event["message"]

		# Send message to WebSocket
		await self.send(text_data=json.dumps({"message": message}))






