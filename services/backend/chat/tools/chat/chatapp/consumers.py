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
		text_data_json["room_name"] = self.room_name  # Add room_name to the data
		serializer = self.serializer_class(data=text_data_json)
		# logger.debug(text_data_json)
		if serializer.is_valid():
			await self.save_message(serializer)
			user_id = serializer.data.get('user_id')
			message = serializer.data.get('message')
			time = serializer.data.get('timestamp')
			await self.channel_layer.group_send(
				self.room_group_name, {
					"type": "chat.message",
					"message": message,
					"user_id": user_id,
					"time":	time,
				}
			)

	@sync_to_async
	def save_message(self, serializer):
		# logger.info("Saving message")
		# logger.info(self.room_name)
		# logger.debug(serializer)
		serializer.save()  # No need to assign room_name here
		# logger.debug(serializer.data)

	# 	Message.objects.create(user_id=user_id, room_name=room_name, message=message)


	# Receive message from room group
	async def chat_message(self, event):
		message = event["message"]
		user_id = event["user_id"]
		time = event["time"]

		# Send message to WebSocket
		await self.send(text_data=json.dumps({"message": message, "user_id": user_id, "time": time}))






