import json
import logging
from channels.generic.websocket import WebsocketConsumer
from django.shortcuts import get_object_or_404
from urllib.parse import parse_qs

from .models import player, map
from .serializers import PlayerModelSerializer, editplayerModelSerializer

logger = logging.getLogger(__name__)

class PlayerConsumer(WebsocketConsumer):
    def connect(self):
        self.accept()
        query_string = self.scope['query_string'].decode()
        params = parse_qs(query_string)
        user_id = params.get('userID', [None])[0]
        if user_id is not None:
            playerobj = get_object_or_404(player, userID=user_id)
            basejson = {
                    "userID": playerobj.userID,
                    "posX": playerobj.posX,
                    "posY": playerobj.posY,
                    "orientation": playerobj.orientation,
                    "active": True
                }
            instance = editplayerModelSerializer(playerobj, data=basejson)
            if instance.is_valid():
                instance.save()
                json_data = json.dumps(instance.data)
                self.send(json_data)
        

    def disconnect(self, close_code):
        query_string = self.scope['query_string'].decode()
        params = parse_qs(query_string)
        user_id = params.get('userID', [None])[0]
        if user_id is not None:
            playerobj = get_object_or_404(player, userID=user_id)
            basejson = {
                "userID": playerobj.userID,
                "posX": playerobj.posX,
                "posY": playerobj.posY,
                "orientation": playerobj.orientation,
                "active": False
            }
            instance = editplayerModelSerializer(playerobj, data=basejson)
            if instance.is_valid():
                instance.save()

    def receive(self, text_data):
        try:
            text_data_json = json.loads(text_data)
            # logger.info("data receive ", text_data_json)
            id = text_data_json.get("userID")
            if id:
                playerobj = get_object_or_404(player, userID=id)
                data = text_data_json.get("new");
                # logger.info(data)
                basejson = {
                    "userID": playerobj.userID,
                    "posX": playerobj.posX,
                    "posY": playerobj.posY,
                    "orientation": playerobj.orientation,
                    "active": playerobj.active
                }
                match data:
                    case "y+":
                        if (basejson["orientation"] == "S"):
                            if (map[playerobj.posY + 1][playerobj.posX] == 0):
                                basejson["posY"] += 1
                                basejson["orientation"] = "S"
                            else:
                                logger.info("match y+ failed")
                        else:
                            basejson["orientation"] = "S"
                    case "y-":
                        if (basejson["orientation"] == "N"):
                            if (map[playerobj.posY - 1 ][playerobj.posX] == 0):
                                basejson["posY"] -= 1
                                basejson["orientation"] = "N"
                            else:
                                logger.info("match y- failed")
                        else:
                            basejson["orientation"] = "N"
                    case "x+":
                        if (basejson["orientation"] == "E"):
                            if (map[playerobj.posY][playerobj.posX + 1] == 0):
                                basejson["posX"] += 1
                                basejson["orientation"] = "E"
                            else:
                                logger.info("match x+ failed")
                        else:
                            basejson["orientation"] = "E"
                    case "x-":
                        if (basejson["orientation"] == "W"):
                            if (map[playerobj.posY][playerobj.posX - 1] == 0):
                                basejson["posX"] -= 1
                                basejson["orientation"] = "W"
                            else:
                                logger.info("match x- failed")
                        else:
                            basejson["orientation"] = "W"
                    case _:
                        logger.info("data not found")
                # logger.info(basejson)
                instance = editplayerModelSerializer(playerobj, data=basejson)
                if instance.is_valid():
                    instance.save()
                    json_data = json.dumps(instance.data)
                    self.send(json_data)
        except Exception as e:
            logger.error("error", e)
