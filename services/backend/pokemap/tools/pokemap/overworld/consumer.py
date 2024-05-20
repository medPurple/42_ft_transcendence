import json
import logging
from channels.generic.websocket import WebsocketConsumer
from django.shortcuts import get_object_or_404
from urllib.parse import parse_qs

from .models import player, map
from .serializers import PlayerModelSerializer, editplayerModelSerializer
import random

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
                    "active": True,
                    "event": None,
                    "target": None,
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
                "active": False,
                "event": None,
                "target": None,
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
                    "active": playerobj.active,
                    "event": playerobj.event,
                    "target": playerobj.target,
                }
                match data:
                    case "y+":
                        if (basejson["orientation"] == "S"):
                            if (map[playerobj.posY + 1][playerobj.posX] == 0):
                                basejson["posY"] += 1
                                basejson["orientation"] = "S"
                            elif (map[playerobj.posY + 1][playerobj.posX] == 2):
                                if is_entering_combat():
                                    basejson = add_event(basejson, "combat")
                                else:
                                    basejson["posY"] += 1
                                    basejson["orientation"] = "S"
                            elif (map[playerobj.posY + 1][playerobj.posX] == 3):
                                basejson = add_event(basejson, "door")
                            elif (map[playerobj.posY + 1][playerobj.posX] == 4):
                                basejson = add_event(basejson, "people")
                            else:
                                logger.info("match y+ failed")
                        else:
                            basejson["orientation"] = "S"
                    case "y-":
                        if (basejson["orientation"] == "N"):
                            if (map[playerobj.posY - 1 ][playerobj.posX] == 0):
                                basejson["posY"] -= 1
                                basejson["orientation"] = "N"
                            elif (map[playerobj.posY - 1 ][playerobj.posX] == 2):
                                if is_entering_combat():
                                    basejson = add_event(basejson, "combat")
                                else:
                                    basejson["posY"] -= 1
                                    basejson["orientation"] = "N"
                            elif (map[playerobj.posY - 1 ][playerobj.posX] == 3):
                                basejson = add_event(basejson, "door")
                            elif (map[playerobj.posY - 1 ][playerobj.posX] == 4):
                                basejson = add_event(basejson, "people")
                            else:
                                logger.info("match y- failed")
                        else:
                            basejson["orientation"] = "N"
                    case "x+":
                        if (basejson["orientation"] == "E"):
                            if (map[playerobj.posY][playerobj.posX + 1] == 0):
                                basejson["posX"] += 1
                                basejson["orientation"] = "E"
                            elif (map[playerobj.posY][playerobj.posX + 1] == 2):
                                if is_entering_combat():
                                    basejson = add_event(basejson, "combat")
                                else:
                                    basejson["posX"] += 1
                                    basejson["orientation"] = "E"
                            elif (map[playerobj.posY][playerobj.posX + 1] == 3):
                                basejson = add_event(basejson, "door")
                            elif (map[playerobj.posY][playerobj.posX + 1] == 4):
                                basejson = add_event(basejson, "people")
                            else:
                                logger.info("match x+ failed")
                        else:
                            basejson["orientation"] = "E"
                    case "x-":
                        if (basejson["orientation"] == "W"):
                            if (map[playerobj.posY][playerobj.posX - 1] == 0):
                                basejson["posX"] -= 1
                                basejson["orientation"] = "W"
                            elif (map[playerobj.posY][playerobj.posX - 1] == 2):
                                if is_entering_combat():
                                    basejson = add_event(basejson, "combat")
                                else:
                                    basejson["posX"] -= 1
                                    basejson["orientation"] = "W"
                            elif (map[playerobj.posY][playerobj.posX - 1] == 3):
                                basejson = add_event(basejson, "door")
                            elif (map[playerobj.posY][playerobj.posX - 1] == 4):
                                basejson = add_event(basejson, "people")
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



def is_entering_combat():
    return random.randint(1, 5) == 1

def add_event(basejson, event):
    basejson["event"] = event
    
    return basejson