import json
from json.decoder import JSONDecodeError
from channels.generic.websocket import WebsocketConsumer
from .models import WaitingModel
from .serializers import WaitingModelSerializer
from django.shortcuts import get_object_or_404
from .views import pong_waitinglist, tpong_waitinglist, pkm_waitinglist
import logging

logger = logging.getLogger(__name__)

class QueueConsumer(WebsocketConsumer):
    def connect(self):
        self.accept()


    def disconnect(self, close_code):
        pass

    def receive(self, text_data):
        logger.info(text_data)
        try:
            text_data_json = json.loads(text_data)
            user_id = text_data_json.get("id") 
            logger.info(user_id)
            try:
                instance = WaitingModel.objects.get(userID=user_id)
            except WaitingModel.DoesNotExist:
                pass
            else:
                serializer = WaitingModelSerializer(instance)
                serialized_data = json.dumps(serializer.data)
                self.send(serialized_data)
        except Exception:
            pass


# Django channel group 