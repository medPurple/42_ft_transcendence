import json
from json.decoder import JSONDecodeError
from channels.generic.websocket import WebsocketConsumer
from django.shortcuts import get_object_or_404
import logging

logger = logging.getLogger(__name__)

class QueueConsumer(WebsocketConsumer):
    def connect(self):
        from .models import WaitingModel
        from .serializers import WaitingModelSerializer
        self.accept()
        logger.info('Connected')


    def disconnect(self, close_code):
        pass

    def receive(self, text_data):
        logger.info(text_data)
        try:
            text_data_json = json.loads(text_data)
        except Exception:
            pass


# Django channel group 