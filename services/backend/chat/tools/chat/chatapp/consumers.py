import json
from channels.generic.websocket import WebsocketConsumer
import logging

logger = logging.getLogger(__name__)

class ChatConsumer(WebsocketConsumer):
	def connect(self):
		self.accept()

	def disconnect(self, close_code):
		pass

	def receive(self, text_data):
		try:
			text_data_json = json.loads(text_data)
			logger.debug(text_data_json)
		except Exception:
			pass
		self.send(json.dumps({"test":"ok"}))






