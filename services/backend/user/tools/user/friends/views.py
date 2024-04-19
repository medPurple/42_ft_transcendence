from django.shortcuts import render, redirect, get_object_or_404
from rest_framework.views import APIView
from rest_framework.decorators import api_view, permission_classes, action
from rest_framework import permissions, status
from rest_framework.response import Response

from profiles.models import CustomUser
from friends.models import Friend_Request
from friends.serializers import Friend_RequestSerializer

class SendFriendRequestView(APIView):
	permission_classes = (permissions.IsAuthenticated,)
	def post(self, request):
		from_user = request.user
		friend_username = request.data.get('friend_username')
		try:
			to_user = CustomUser.objects.get(username=friend_username)
			friend_request, created = Friend_Request.objects.get_or_create(
				from_user=from_user, to_user=to_user)
			
			if created:
				return Response({'success': True}, status=status.HTTP_201_CREATED)
			else:
				return Response({'error': 'Send request failed'}, status=status.HTTP_400_BAD_REQUEST)
		except CustomUser.DoesNotExist:
			return Response({'error': 'User not found'}, status=status.HTTP_404_NOT_FOUND)
		except Exception as e:
			return Response({'error': str(e)}, status=status.HTTP_400_BAD_REQUEST)

class FriendRequestView(APIView):
	permission_classes = (permissions.IsAuthenticated,)
	def post(self, request):
		from_user = request.user
		friend_username = request.data.get('friend_username')
		try:
			to_user = CustomUser.objects.get(username=friend_username)
			friend_request = Friend_Request.objects.get(
				from_user=to_user, to_user=from_user)
			from_user.friends.add(to_user)
			to_user.friends.add(from_user)
			friend_request.delete()
			return Response({'success': True}, status=status.HTTP_200_OK)
		except Friend_Request.DoesNotExist:
			return Response({'error': 'Friend request not found'}, status=status.HTTP_404_NOT_FOUND)
		except Exception as e:
			return Response({'error': str(e)}, status=status.HTTP_400_BAD_REQUEST)

	def get(self, request):
		friend_requests = Friend_Request.objects.filter(to_user=request.user)
		serializer = Friend_RequestSerializer(friend_requests, many=True)
		return Response({'success': True, 'friend_requests': serializer.data}, status=status.HTTP_200_OK)

	def delete(self, request):
		from_user = request.user
		friend_username = request.data.get('friend_username')
		try:
			to_user = CustomUser.objects.get(username=friend_username)
			friend_request = Friend_Request.objects.get(
				from_user=from_user, to_user=to_user)
			friend_request.delete()
			return Response({'success': True}, status=status.HTTP_200_OK)
		except Friend_Request.DoesNotExist:
			return Response({'error': 'Friend request not found'}, status=status.HTTP_404_NOT_FOUND)
		except Exception as e:
			return Response({'error': str(e)}, status=status.HTTP_400_BAD_REQUEST)
	
		

# @login_required
# def	accept_friend_request(request, requestID):
# 	friend_request = Friend_Request.objects.get(id=requestID)
# 	if friend_request.to_user == request.user:
# 		friend_request.to_user.friends.add(friend_request.from_user)
# 		friend_request.from_user.friends.add(friend_request.to_user)
# 		friend_request.delete()
# 		return HttpResponse('friend request accepted')
# 	else:
# 		return HttpResponse('friend request not accepted')

# @login_required
# def	reject_friend_request(request, requestID):
# 	friend_request = Friend_Request.objects.get(id=requestID)
# 	if friend_request.to_user == request.user:
# 		friend_request.delete()
# 		return HttpResponse('friend request rejected')
# 	else:
# 		return HttpResponse('friend request not rejected')

# @login_required
# def	delete_friend(request, userID):
# 	friend_profile = get_object_or_404(CustomUser, id=userID)
# 	request.user.friends.remove(friend_profile)
# 	friend_profile.friends.remove(request.user)
# 	return redirect('friends')



# @login_required
# def friend_profile(request, userID):
# 	friend = get_object_or_404(CustomUser, id=userID)
# 	return render(request, 'friend_profile.html', {'friend': friend})

# @login_required
# def all_users(request):
# 	# Récupérer tous les utilisateurs enregistrés dans la base de données
# 	users = CustomUser.objects.all()
# 	friend_requests = Friend_Request.objects.filter(to_user=request.user)
# 	return render(request, 'friends.html',
# 			{'users': users, 'friend_requests' : friend_requests})

