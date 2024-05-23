import json
import logging
import asyncio
from channels.generic.websocket import WebsocketConsumer, AsyncWebsocketConsumer
from asgiref.sync import sync_to_async
from django.shortcuts import get_object_or_404
from urllib.parse import parse_qs

from .models import player, map
from .serializers import PlayerModelSerializer, editplayerModelSerializer
import random

logger = logging.getLogger(__name__)

class PlayerConsumer(AsyncWebsocketConsumer):
    async def connect(self):
        await self.accept()
        logger.info("connected")
        self.send_message_task = asyncio.create_task(self.send_message())
        logger.info("task created")


        

    async def disconnect(self, close_code):
        self.send_message_task.cancel()

    async def receive(self, text_data):
        try:
            text_data_json = json.loads(text_data)
            json_data = {}
            id = text_data_json.get("userID")
            if (id and text_data_json.get("action") == "connect"):
                playerobj = await sync_to_async(get_object_or_404)(player, userID=id)
                basejson = {
                    "userID": playerobj.userID,
                    "posX": playerobj.posX,
                    "posY": playerobj.posY,
                    "orientation": playerobj.orientation,
                    "active": True,
                }
                instance = editplayerModelSerializer(playerobj, data=basejson)
                if instance.is_valid():
                    await sync_to_async(instance.save,)()
            elif (id and text_data_json.get("action") == "move"):
                playerobj = await sync_to_async(get_object_or_404)(player, userID=id)
                data = text_data_json.get("new")
                basejson = {
                    "userID": playerobj.userID,
                    "posX": playerobj.posX,
                    "posY": playerobj.posY,
                    "orientation": playerobj.orientation,
                    "active": playerobj.active,
                }
                match data:
                    case "y+":
                        json_data = await modify_json_ymore(basejson, playerobj)
                    case "y-":
                        json_data = await modify_json_yless(basejson, playerobj)
                    case "x+":
                        json_data = await modify_json_xmore(basejson, playerobj)
                    case "x-":
                        json_data = await modify_json_xless(basejson, playerobj)
                    case _:
                        logger.info("data not found")
            all_players = await sync_to_async(player.objects.all, thread_sensitive=True)()
            all_players_json = await sync_to_async(PlayerModelSerializer, thread_sensitive=True)(all_players, many=True)
            # if "event" in json_data:
            #     all_players_json["event"] = json_data["event"]            logger.info("all players data done")
            all_players_data = await sync_to_async(lambda: all_players_json.data, thread_sensitive=True)()
            self.all_players_data = await sync_to_async(json.dumps, thread_sensitive=True)(all_players_data)

        except Exception as e:
            logger.error(f"error: {e}")
        
    async def send_message(self):
        fps = 30
        frame_duration = 1.0 / fps

        while True:
            start_time = asyncio.get_running_loop().time()

            # Envoyer les données stockées
            if hasattr(self, 'all_players_data'):
                await self.send(text_data=self.all_players_data)

            elapsed_time = asyncio.get_running_loop().time() - start_time
            if elapsed_time < frame_duration:
                await asyncio.sleep(frame_duration - elapsed_time)


async def modify_json_xless(basejson, playerobj):
    if (basejson["orientation"] == "W"):

        if (map[playerobj.posY][playerobj.posX - 1] == 0):
            basejson["posX"] -= 1
            basejson["orientation"] = "W"
            instance = editplayerModelSerializer(playerobj, data=basejson)
            if instance.is_valid():
                await sync_to_async(instance.save,)()
                instance_data = await sync_to_async(lambda: instance.data, thread_sensitive=True)()
                json_data = await sync_to_async(json.dumps, thread_sensitive=True)(instance_data)
                return json_data

        elif (map[playerobj.posY][playerobj.posX - 1] == 2):
            if is_entering_combat():
                instance = editplayerModelSerializer(playerobj, data=basejson)
                if instance.is_valid():
                    await sync_to_async(instance.save,)()
                    instance_data = await sync_to_async(lambda: instance.data, thread_sensitive=True)()
                    data_with_event = await add_event(instance_data, "combat")
                    json_data = await sync_to_async(json.dumps, thread_sensitive=True)(data_with_event)
                    return json_data
            else:
                basejson["posX"] -= 1
                basejson["orientation"] = "W"
                instance = editplayerModelSerializer(playerobj, data=basejson)
                if instance.is_valid():
                    await sync_to_async(instance.save,)()
                    instance_data = await sync_to_async(lambda: instance.data, thread_sensitive=True)()
                    json_data = await sync_to_async(json.dumps, thread_sensitive=True)(instance_data)
                    return json_data

        elif (map[playerobj.posY][playerobj.posX - 1] == 3):
            instance = editplayerModelSerializer(playerobj, data=basejson)
            if instance.is_valid():
                await sync_to_async(instance.save,)()
                instance_data = await sync_to_async(lambda: instance.data, thread_sensitive=True)()
                data_with_event = await add_event(instance_data, "door")
                json_data = await sync_to_async(json.dumps, thread_sensitive=True)(data_with_event)
                return json_data

        elif (map[playerobj.posY][playerobj.posX - 1] == 4):
            instance = editplayerModelSerializer(playerobj, data=basejson)
            if instance.is_valid():
                await sync_to_async(instance.save,)()
                instance_data = await sync_to_async(lambda: instance.data, thread_sensitive=True)()
                data_with_event = await add_event(instance_data, "people")
                json_data = await sync_to_async(json.dumps, thread_sensitive=True)(data_with_event)
                return json_data

        else:
            logger.info("match x- failed")
    else:
        basejson["orientation"] = "W"
        instance = editplayerModelSerializer(playerobj, data=basejson)
        if instance.is_valid():
            await sync_to_async(instance.save,)()
            instance_data = await sync_to_async(lambda: instance.data, thread_sensitive=True)()
            json_data = await sync_to_async(json.dumps, thread_sensitive=True)(instance_data)
            return json_data

async def modify_json_xmore(basejson, playerobj):
    if (basejson["orientation"] == "E"):

        if (map[playerobj.posY][playerobj.posX + 1] == 0):
            basejson["posX"] += 1
            basejson["orientation"] = "E"
            instance = editplayerModelSerializer(playerobj, data=basejson)
            if instance.is_valid():
                await sync_to_async(instance.save,)()
                instance_data = await sync_to_async(lambda: instance.data, thread_sensitive=True)()
                json_data = await sync_to_async(json.dumps, thread_sensitive=True)(instance_data)
                return json_data

        elif (map[playerobj.posY][playerobj.posX + 1] == 2):
            if is_entering_combat():
                instance = editplayerModelSerializer(playerobj, data=basejson)
                if instance.is_valid():
                    await sync_to_async(instance.save,)()
                    instance_data = await sync_to_async(lambda: instance.data, thread_sensitive=True)()
                    data_with_event = await add_event(instance_data, "combat")
                    json_data = await sync_to_async(json.dumps, thread_sensitive=True)(data_with_event)
                    return json_data
            else:
                basejson["posX"] += 1
                basejson["orientation"] = "E"
                instance = editplayerModelSerializer(playerobj, data=basejson)
                if instance.is_valid():
                    await sync_to_async(instance.save,)()
                    instance_data = await sync_to_async(lambda: instance.data, thread_sensitive=True)()
                    json_data = await sync_to_async(json.dumps, thread_sensitive=True)(instance_data)
                    return json_data

        elif (map[playerobj.posY][playerobj.posX + 1] == 3):
            instance = editplayerModelSerializer(playerobj, data=basejson)
            if instance.is_valid():
                await sync_to_async(instance.save,)()
                instance_data = await sync_to_async(lambda: instance.data, thread_sensitive=True)()
                data_with_event = await add_event(instance_data, "door")
                json_data = await sync_to_async(json.dumps, thread_sensitive=True)(data_with_event)
                return json_data

        elif (map[playerobj.posY][playerobj.posX + 1] == 4):
            instance = editplayerModelSerializer(playerobj, data=basejson)
            if instance.is_valid():
                await sync_to_async(instance.save,)()
                instance_data = await sync_to_async(lambda: instance.data, thread_sensitive=True)()
                data_with_event = await add_event(instance_data, "people")
                json_data = await sync_to_async(json.dumps, thread_sensitive=True)(data_with_event)
                return json_data

        else:
            logger.info("match x+ failed")
    else:
        basejson["orientation"] = "E"
        instance = editplayerModelSerializer(playerobj, data=basejson)
        if instance.is_valid():
            await sync_to_async(instance.save,)()
            instance_data = await sync_to_async(lambda: instance.data, thread_sensitive=True)()
            json_data = await sync_to_async(json.dumps, thread_sensitive=True)(instance_data)
            return json_data

async def modify_json_yless(basejson, playerobj):
    if (basejson["orientation"] == "N"):
        if (map[playerobj.posY - 1 ][playerobj.posX] == 0):
            basejson["posY"] -= 1
            basejson["orientation"] = "N"
            instance = editplayerModelSerializer(playerobj, data=basejson)
            if instance.is_valid():
                await sync_to_async(instance.save,)()
                instance_data = await sync_to_async(lambda: instance.data, thread_sensitive=True)()
                json_data = await sync_to_async(json.dumps, thread_sensitive=True)(instance_data)
                return json_data
            
        elif (map[playerobj.posY - 1 ][playerobj.posX] == 2):
            if is_entering_combat():
                instance = editplayerModelSerializer(playerobj, data=basejson)
                if instance.is_valid():
                    await sync_to_async(instance.save,)()
                    instance_data = await sync_to_async(lambda: instance.data, thread_sensitive=True)()
                    data_with_event = await add_event(instance_data, "combat")
                    json_data = await sync_to_async(json.dumps, thread_sensitive=True)(data_with_event)
                    return json_data
            else:
                basejson["posY"] -= 1
                basejson["orientation"] = "N"
                instance = editplayerModelSerializer(playerobj, data=basejson)
                if instance.is_valid():
                    await sync_to_async(instance.save,)()
                    instance_data = await sync_to_async(lambda: instance.data, thread_sensitive=True)()
                    json_data = await sync_to_async(json.dumps, thread_sensitive=True)(instance_data)
                    return json_data
        elif (map[playerobj.posY - 1 ][playerobj.posX] == 3):
            instance = editplayerModelSerializer(playerobj, data=basejson)
            if instance.is_valid():
                await sync_to_async(instance.save,)()
                instance_data = await sync_to_async(lambda: instance.data, thread_sensitive=True)()
                data_with_event = await add_event(instance_data, "door")
                json_data = await sync_to_async(json.dumps, thread_sensitive=True)(data_with_event)
                return json_data
        elif (map[playerobj.posY - 1 ][playerobj.posX] == 4):
            instance = editplayerModelSerializer(playerobj, data=basejson)
            if instance.is_valid():
                await sync_to_async(instance.save,)()
                instance_data = await sync_to_async(lambda: instance.data, thread_sensitive=True)()
                data_with_event = await add_event(instance_data, "people")
                json_data = await sync_to_async(json.dumps, thread_sensitive=True)(data_with_event)
                return json_data
        else:
            logger.info("match y- failed")
    else:
        basejson["orientation"] = "N"
        instance = editplayerModelSerializer(playerobj, data=basejson)
        if instance.is_valid():
            await sync_to_async(instance.save,)()
            instance_data = await sync_to_async(lambda: instance.data, thread_sensitive=True)()
            json_data = await sync_to_async(json.dumps, thread_sensitive=True)(instance_data)
            return json_data

async def modify_json_ymore(basejson, playerobj):
    if (basejson["orientation"] == "S"):
        if (map[playerobj.posY + 1][playerobj.posX] == 0):
            basejson["posY"] += 1
            basejson["orientation"] = "S"
            instance = editplayerModelSerializer(playerobj, data=basejson)
            if instance.is_valid():
                await sync_to_async(instance.save,)()
                instance_data = await sync_to_async(lambda: instance.data, thread_sensitive=True)()
                json_data = await sync_to_async(json.dumps, thread_sensitive=True)(instance_data)
                return json_data
        elif (map[playerobj.posY + 1][playerobj.posX] == 2):
            if is_entering_combat():
                instance = editplayerModelSerializer(playerobj, data=basejson)
                if instance.is_valid():
                    await sync_to_async(instance.save,)()
                    instance_data = await sync_to_async(lambda: instance.data, thread_sensitive=True)()
                    data_with_event = await add_event(instance_data, "combat")
                    json_data = await sync_to_async(json.dumps, thread_sensitive=True)(data_with_event)
                    return json_data
            else:
                basejson["posY"] += 1
                basejson["orientation"] = "S"
                instance = editplayerModelSerializer(playerobj, data=basejson)
                if instance.is_valid():
                    await sync_to_async(instance.save,)()
                    instance_data = await sync_to_async(lambda: instance.data, thread_sensitive=True)()
                    json_data = await sync_to_async(json.dumps, thread_sensitive=True)(instance_data)
                    return json_data
        elif (map[playerobj.posY + 1][playerobj.posX] == 3):
            instance = editplayerModelSerializer(playerobj, data=basejson)
            if instance.is_valid():
                await sync_to_async(instance.save,)()
                instance_data = await sync_to_async(lambda: instance.data, thread_sensitive=True)()
                data_with_event = await add_event(instance_data, "door")
                json_data = await sync_to_async(json.dumps, thread_sensitive=True)(data_with_event)
                return json_data
        elif (map[playerobj.posY + 1][playerobj.posX] == 4):
            instance = editplayerModelSerializer(playerobj, data=basejson)
            if instance.is_valid():
                await sync_to_async(instance.save,)()
                instance_data = await sync_to_async(lambda: instance.data, thread_sensitive=True)()
                data_with_event = await add_event(instance_data, "people")
                json_data = await sync_to_async(json.dumps, thread_sensitive=True)(data_with_event)
                return json_data
        else:
            logger.info("match y+ failed")
    else:
        basejson["orientation"] = "S"
        instance = editplayerModelSerializer(playerobj, data=basejson)
        if instance.is_valid():
            await sync_to_async(instance.save,)()
            instance_data = await sync_to_async(lambda: instance.data, thread_sensitive=True)()
            json_data = await sync_to_async(json.dumps, thread_sensitive=True)(instance_data)
            return json_data

def is_entering_combat():
    return random.randint(1, 5) == 1

async def add_event(json_data, event):
    json_data["event"] = event
    return json_data

