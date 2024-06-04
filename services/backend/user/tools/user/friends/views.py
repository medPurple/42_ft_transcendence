from django.shortcuts import render, redirect, get_object_or_404
from rest_framework.views import APIView
from rest_framework.decorators import api_view, permission_classes, action
from rest_framework import permissions, status
from rest_framework.response import Response
from rest_framework.authentication import BaseAuthentication
from profiles.views import JWTAuthentication

from profiles.models import CustomUser
from friends.models import FriendRequest, BlockRequest
from friends.serializers import FriendRequestSerializer, FriendsSerializer, BlockRequestSerializer
from django.core.exceptions import PermissionDenied

import logging

logger = logging.getLogger(__name__)

# class SendFriendRequestView(APIView):
# 	authentication_classes = [JWTAuthentication]
# 	def post(self, request):
# 		from_user = request.user
# 		friend_username = request.data.get('friend_username')
# 		try:
# 			to_user = CustomUser.objects.get(username=friend_username)
# 			friend_request, created = FriendRequest.objects.get_or_create(
# 				from_user=from_user, to_user=to_user)

# 			if created:
# 				return Response({'success': True}, status=status.HTTP_201_CREATED)
# 			else:
# 				return Response({'error': 'Send request failed'}, status=status.HTTP_400_BAD_REQUEST)
# 		except CustomUser.DoesNotExist:
# 			return Response({'error': 'User not found'}, status=status.HTTP_404_NOT_FOUND)
# 		except Exception as e:
# 			return Response({'error': str(e)}, status=status.HTTP_400_BAD_REQUEST)

# class FriendRequestView(APIView):
# 	authentication_classes = [JWTAuthentication]
# 	def post(self, request):
# 		from_user = request.user
# 		friend_username = request.data.get('friend_username')
# 		try:
# 			to_user = CustomUser.objects.get(username=friend_username)
# 			friend_request = FriendRequest.objects.get(
# 				from_user=to_user, to_user=from_user)
# 			from_user.friends.add(to_user)
# 			to_user.friends.add(from_user)
# 			friend_request.delete()
# 			return Response({'success': True}, status=status.HTTP_200_OK)
# 		except FriendRequest.DoesNotExist:
# 			return Response({'error': 'Friend request not found'}, status=status.HTTP_404_NOT_FOUND)
# 		except Exception as e:
# 			return Response({'error': str(e)}, status=status.HTTP_400_BAD_REQUEST)

#     # method to get all friend requests
# 	def get(self, request):
# 		friend_requests = FriendRequest.objects.filter(to_user=request.user)
# 		send_friend_requests = FriendRequest.objects.filter(from_user=request.user)
# 		serializer = FriendRequestSerializer(friend_requests, many=True)
# 		serializer_send = FriendRequestSerializer(send_friend_requests, many=True)
# 		return Response({'success': True, 'friend_requests': serializer.data,
# 		'send_requests': serializer_send.data},
# 		status=status.HTTP_200_OK)

# 	# delete friend's request
# 	def delete(self, request):
# 		from_user = request.user
# 		friend_username = request.data.get('friend_username')
# 		try:
# 			to_user = CustomUser.objects.get(username=friend_username)
# 			friend_request = FriendRequest.objects.get(
# 				from_user=to_user, to_user=from_user)
# 			friend_request.delete()
# 			return Response({'success': True}, status=status.HTTP_200_OK)
# 		except FriendRequest.DoesNotExist:
# 			return Response({'error': 'Friend request not found'}, status=status.HTTP_404_NOT_FOUND)
# 		except Exception as e:
# 			return Response({'error': str(e)}, status=status.HTTP_400_BAD_REQUEST)

class FriendsView(APIView):
	authentication_classes = [JWTAuthentication]
	def get(self, request, username=None):
		if username:
			friend = get_object_or_404(request.user.friends, username=username)
			serializer = FriendsSerializer(friend)
		else:
			friends = request.user.friends.all()
			serializer = FriendsSerializer(friends, many=True)
		return Response({'success': True, 'friends': serializer.data}, status=status.HTTP_200_OK)
	# delete friend
	# def delete(self, request):
	# 	from_user = request.user
	# 	friend_username = request.data.get('friend_username')
	# 	try:
	# 		friend = CustomUser.objects.get(username=friend_username)
	# 		if friend in from_user.friends.all():
	# 			from_user.friends.remove(friend)
	# 			friend.friends.remove(from_user)
	# 			return Response({'success': True}, status=status.HTTP_200_OK)
	# 		else:
	# 			return Response({'error': 'Friend not found in friend list'}, status=status.HTTP_404_NOT_FOUND)
	# 	except CustomUser.DoesNotExist:
	# 		return Response({'error': 'User not found'}, status=status.HTTP_404_NOT_FOUND)
	# 	except Exception as e:
	# 		return Response({'error': str(e)}, status=status.HTTP_400_BAD_REQUEST)

class BlockView(APIView):
	authentication_classes = [JWTAuthentication]
	def get(self, request, username=None):
		user = request.user
		other_user = get_object_or_404(CustomUser, username=username)
		user_blocked_other = BlockRequest.objects.filter(blocked=user, is_blocked=other_user).exists()
		other_user_blocked_user = BlockRequest.objects.filter(blocked=other_user, is_blocked=user).exists()

		if user_blocked_other or other_user_blocked_user:
			return Response({
				'success': True,
				'user_blocked_other': user_blocked_other,
				'other_user_blocked_user': other_user_blocked_user
			}, status=status.HTTP_200_OK)
		else:
			return Response({'success': False}, status=status.HTTP_200_OK)

	def post(self, request, username=None):
		blocked = request.user
		is_blocked = get_object_or_404(CustomUser, username=username)
		try:
			BlockRequest.objects.create(blocked=blocked, is_blocked=is_blocked)
			return Response({'success': True}, status=status.HTTP_201_CREATED)
		except Exception as e:
			return Response({'error': str(e)}, status=status.HTTP_400_BAD_REQUEST)

	def delete(self, request, username=None):
		user = request.user
		to_unblock = get_object_or_404(CustomUser, username=username)
		block_request = BlockRequest.objects.filter(blocked=user, is_blocked=to_unblock).first()
		if block_request:
			block_request.delete()
			return Response({'success': True}, status=status.HTTP_200_OK)
		else:
			raise PermissionDenied('You are not authorized to unblock this user')
