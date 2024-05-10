import json

# from channels.db import sync_to_async
from asgiref.sync import sync_to_async
from channels.generic.websocket import AsyncJsonWebsocketConsumer
from channels.db import database_sync_to_async
from django.contrib.auth import get_user_model
from .models import FriendRequest
from profiles.models import CustomUser
from .serializers import FriendRequestSerializer
from django.shortcuts import get_object_or_404
from urllib.parse import parse_qs
import requests

import logging

logger = logging.getLogger(__name__)

# CustomUser = get_user_model()

# Dans le front il faudrait que j envoie le JWTTOKEN et maybe l'id

class FriendsConsumer(AsyncJsonWebsocketConsumer):
    async def connect(self):
        query_string = self.scope['query_string'].decode()
        params = parse_qs(query_string)
        token = params.get('token', [None])[0]
        logger.debug('TOKRRRRREN')
        logger.debug(token)
        if token is not None:
            token_service_url = 'https://JWToken:4430/api/token/'
            try:
                token_response = requests.get(token_service_url, headers={'Authorization': f'Bearer {token}'}, verify=False)                
                token_response.raise_for_status()
                user_id = token_response.json().get('user_id')
                logger.debug('USER_ID')
                logger.debug(user_id)
                user = await self.get_user(user_id)
                if user is not None:
                    self.scope['user'] = user
                    self.user = user
                    await self.accept()
                else:
                    await self.close()
            except (requests.exceptions.RequestException, CustomUser.DoesNotExist):
                await self.close()
        else:
            await self.close()

    async def disconnect(self, close_code):
        pass

    async def receive_json(self, content):
        command = content.get("command", None)
        try:
            if command == "send_request":
                await self.send_request(content["friend_username"])
            elif command == "accept_request":
                await self.accept_request(content["friend_username"])
            elif command == "delete_request":
                await self.delete_request(content["friend_username"])
            elif command == "get_requests":
                await self.get_requests()
        except CustomUser.DoesNotExist:
            await self.send_json({"error": "User not found"})
        except FriendRequest.DoesNotExist:
            await self.send_json({"error": "Friend request not found"})

    
    @database_sync_to_async
    def get_user(self, user_id):
        try:
            return CustomUser.objects.get(user_id=user_id)
        except CustomUser.DoesNotExist:
            return None
    
    @database_sync_to_async
    def send_request(self, friend_username):
        to_user = CustomUser.objects.get(username=friend_username)
        friend_request, created = FriendRequest.objects.get_or_create(
            from_user=self.user, to_user=to_user)
        if created:
            return {"success": True}
        else:
            return {"error": "Send request failed"}

    @database_sync_to_async
    def accept_request(self, friend_username):
        to_user = CustomUser.objects.get(username=friend_username)
        friend_request = FriendRequest.objects.get(
            from_user=to_user, to_user=self.user)
        self.user.friends.add(to_user)
        to_user.friends.add(self.user)
        friend_request.delete()
        return {"success": True}

    @database_sync_to_async
    def delete_request(self, friend_username):
        to_user = CustomUser.objects.get(username=friend_username)
        friend_request = FriendRequest.objects.get(
            from_user=to_user, to_user=self.user)
        friend_request.delete()
        return {"success": True}

    @database_sync_to_async
    def get_requests(self):
        try:
            friend_requests = FriendRequest.objects.filter(to_user=self.user)
            send_friend_requests = FriendRequest.objects.filter(from_user=self.user)
            received_requests = FriendRequestSerializer(friend_requests, many=True).data
            sent_requests = FriendRequestSerializer(send_friend_requests, many=True).data
            return {"success": True, "received_requests": received_requests, "sent_requests": sent_requests}
        except Exception as e:
            return {"success": False, "error": str(e)}