import json

from channels.db import database_sync_to_async
from asgiref.sync import async_to_sync
from channels.generic.websocket import AsyncWebsocketConsumer
import logging
from .models import Message, ChatUser

logger = logging.getLogger(__name__)

class ChatConsumer(AsyncWebsocketConsumer):
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
		message = text_data_json["message"]
		usernamechat = text_data_json.get("usernamechat")
		logger.debug(message)
		logger.debug(usernamechat)

		# Only process the message if a username is provided
		if usernamechat:
			# Save the message to the database
			await self.save_message(usernamechat, self.room_name, message)

			# Send message to room group
			await self.channel_layer.group_send(
				self.room_group_name, {
					"type": "chat.message", 
					"message": f"{usernamechat}: {message}"  # Include the username in the message
				}
			)

	@database_sync_to_async
	def save_message(self, usernamechat, room_name, message):
		user, created = ChatUser.objects.get_or_create(usernamechat=usernamechat)
		Message.objects.create(user=user, room_name=room_name, message=message)

	
	# Receive message from room group
	async def chat_message(self, event):
		message = event["message"]

		# Send message to WebSocket
		await self.send(text_data=json.dumps({"message": message}))






