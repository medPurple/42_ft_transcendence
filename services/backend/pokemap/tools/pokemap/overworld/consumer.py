import json
import logging
from channels.generic.websocket import WebsocketConsumer
logger = logging.getLogger(__name__)

from overworld import models, serializers

class PlayerConsumer(WebsocketConsumer):
    def connect(self):
        self.accept()

    def disconnect(self, close_code):
        pass

    def receive(self, text_data):
        logger.info("test")
        try:
            text_data_json = json.loads(text_data)
            logger.info(text_data_json)
            if text_data_json.get(userID):
                playerobj = get_object_or_404(player, userID=text_data_json.userID)
                match (text_data_json.get("new")):
                    case ("y+"):
                        if (map[playerobj.posX][playerobj.posY + 1] == 0):
                            playerobj.posY += 1
                    case ("y-"):
                        if (map[playerobj.posX][playerobj.posY - 1] == 0):
                            playerobj.posY -= 1
                    case ("x+"):
                        if (map[playerobj.posX + 1][playerobj.posY] == 0):
                            playerobj.posX += 1
                    case ("x-"):
                        if (map[playerobj.posX - 1][playerobj.posY] == 0):
                            playerobj.posX -= 1
                playerobj.save()
                serializer = PlayerModelSerializer(playerobj)
                serialized_data = json.dumps(serializer.data)
                logger.info(serialized_data)
                self.send(serialized_data)
        except Exception:
            pass
            
        # text_data_json = json.loads(text_data)
        # message = text_data_json["message"]
        # self.send(text_data=json.dumps({"message": message}))