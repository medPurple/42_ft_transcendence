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
from asgiref.sync import sync_to_async
from django.db import transaction


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
			elif command == "delete_friend":
				await self.delete_friend(content["friend_username"])
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

	# @database_sync_to_async
	async def send_request(self, friend_username):
		try:
			to_user = await sync_to_async(CustomUser.objects.get)(username=friend_username)
			friend_request, created = await sync_to_async(FriendRequest.objects.get_or_create)(
				from_user=self.user, to_user=to_user)
			if created:
				await self.send(text_data=json.dumps({
					'success': True,
				}))
			else:
				await self.send(text_data=json.dumps({
					'success': False,
					'error': 'Friend request already sent'
				}))
		except CustomUser.DoesNotExist:
			await self.send(text_data=json.dumps({
				'success': False,
				'error': 'User not found'
			}))
		except Exception as e:
			await self.send(text_data=json.dumps({
				'success': False,
				'error': str(e)
			}))


	# @database_sync_to_async
	async def accept_request(self, friend_username):
		try:
			to_user = await sync_to_async(CustomUser.objects.get)(username=friend_username)
			friend_request = await sync_to_async(FriendRequest.objects.get)(
				from_user=to_user, to_user=self.user)

			# Définissez une fonction synchrone pour exécuter la transaction atomique
			def execute_atomic_transaction():
				with transaction.atomic():
					# Ajoutez l'utilisateur ami des deux côtés
					self.user.friends.add(to_user)
					to_user.friends.add(self.user)
					# Supprimez la demande d'ami
					friend_request.delete()

			# Exécutez la fonction synchrone dans un thread
			await sync_to_async(execute_atomic_transaction)()

			await self.send(text_data=json.dumps({
					'success': True,
				}))
		except Exception as e:
			await self.send(text_data=json.dumps({
				'success': False,
				'error': str(e)
			}))


	# @database_sync_to_async
	async def delete_request(self, friend_username):
		try:
			to_user = await sync_to_async(CustomUser.objects.get)(username=friend_username)
			friend_request =  await sync_to_async(FriendRequest.objects.get)(
				from_user=to_user, to_user=self.user)

			def execute_atomic_transaction():
				with transaction.atomic():
					friend_request.delete()

			await sync_to_async(execute_atomic_transaction)()
			await self.send(text_data=json.dumps({
				'success': True,
			}))

		except Exception as e:
			await self.send(text_data=json.dumps({
				'success': False,
				'error': str(e)
			}))

	# @database_sync_to_async
	async def get_requests(self):
		try:
			# Perform the database queries asynchronously
			friend_requests = await sync_to_async(list)(FriendRequest.objects.filter(to_user=self.user))
			send_friend_requests = await sync_to_async(list)(FriendRequest.objects.filter(from_user=self.user))
			# Serialize the data asynchronously and access the data attribute
			received_requests_data = await sync_to_async(lambda: FriendRequestSerializer(friend_requests, many=True).data)()
			sent_requests_data = await sync_to_async(lambda: FriendRequestSerializer(send_friend_requests, many=True).data)()

			await self.send(text_data=json.dumps({
				'success': True,
				'received_requests': received_requests_data,
				'sent_requests': sent_requests_data
			}))
		except Exception as e:
			await self.send(text_data=json.dumps({
				'success': False,
				'error': str(e)
			}))

	async def delete_friend(self, friend_username):
		from_user = self.user  # Assumed self.user contains the current user
		try:
			friend = await sync_to_async(CustomUser.objects.get)(username=friend_username)
			# Check if friend is in from_user's friends list asynchronously
			from_user_friends = await sync_to_async(lambda: list(from_user.friends.all()))()

			if friend in from_user_friends:
				def execute_atomic_transaction():
					with transaction.atomic():
						from_user.friends.remove(friend)
						friend.friends.remove(from_user)
				await sync_to_async(execute_atomic_transaction)()
				await self.send(text_data=json.dumps({'success': True}))
			else:
				await self.send(text_data=json.dumps({'error': 'Friend not found in friend list'}))
		except CustomUser.DoesNotExist:
			await self.send(text_data=json.dumps({'error': 'User not found'}))
		except Exception as e:
			await self.send(text_data=json.dumps({'error': str(e)}))


	# @sync_to_async
	# def get_serialized_data(data):
	# 	self.send_json(data)


