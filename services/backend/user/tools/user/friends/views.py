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


class FriendsView(APIView):
	authentication_classes = [JWTAuthentication]
	def get(self, request, username=None):
		try:
			if username:
				friend = get_object_or_404(request.user.friends, username=username)
				serializer = FriendsSerializer(friend)
			else:
				friends = request.user.friends.all()
				if not friends:
					return Response({'success': True, 'friends': []}, status=status.HTTP_200_OK)
				serializer = FriendsSerializer(friends, many=True)
			return Response({'success': True, 'friends': serializer.data}, status=status.HTTP_200_OK)
		except Exception as e:
			return Response({'success': False}, status=status.HTTP_200_OK)

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
