from django.contrib.auth import authenticate, login, logout
from django.contrib.auth.forms import AuthenticationForm
from django.shortcuts import get_object_or_404
from django.shortcuts import render, redirect
from rest_framework.response import Response
from rest_framework.decorators import api_view, permission_classes, action
from rest_framework.parsers import MultiPartParser, FormParser
from rest_framework import permissions, status
import requests
import logging

from rest_framework.views import APIView
from .forms import CustomUserCreationForm, CustomUserEditForm, CustomUserPasswordForm
from .models import CustomUser
from .serializers import CustomUserRegisterSerializer, CustomUsernameSerializer, CustomUserSerializer

logger = logging.getLogger(__name__)

def user_token(request, user_id):
	token_service_url = 'http://JWToken:8080/api/token/'
	try:
		token_response = requests.post(token_service_url, json={'user_id' : user_id})
		token_response.raise_for_status()
		user_token = token_response.json().get('token')
		return user_token
	except requests.exceptions.RequestException as e:
		print(f"Error token : {e}")
		return None


class AllCustomUserView(APIView):
	permission_classes = (permissions.IsAuthenticated,)
	def get(self, request):
		users = CustomUser.objects.all()
		serializer = CustomUserSerializer(users, many=True)
		return (Response({'success': True, 'users': serializer.data}, status=status.HTTP_200_OK))

class CustomUserRegister(APIView):
	permission_classes = (permissions.AllowAny,)
	def post(self, request):
		form = CustomUserCreationForm(request.POST, request.FILES)
		if form.is_valid():
			user = form.save(commit=False)
			user.is_online = True
			user.save()
			token = user_token(request, user.user_id)
			login(request, user)
			return Response({'success': True, 'token' : token}, status=status.HTTP_201_CREATED)
		else:
			return Response(form.errors, status=status.HTTP_400_BAD_REQUEST)


class CustomUserLogin(APIView):
	permission_classes = (permissions.AllowAny,)
	def post(self, request):
		form = AuthenticationForm(request, request.POST)
		if form.is_valid():
			user = form.get_user()
			token = user_token(request, user.user_id)
			user.is_online = True
			user.save()
			login(request, user)
			return Response({'success': True, 'token' : token},
				status=201)
		else:
			return Response(form.errors, status=status.HTTP_400_BAD_REQUEST)  # Si le formulaire n'est pas valide, renvoyez les erreurs de validation avec le code de statut 400

class CustomUserLogout(APIView):
	permission_classes = (permissions.AllowAny,)
	def post(self, request):
		user = request.user
		user.is_online = False
		user.save()
		token = request.headers.get('Authorization')
		token_service_url = 'http://JWToken:8080/api/token/'
		token_response = requests.get(token_service_url, headers={'Authorization': token})
		logout(request)
		return Response({'message': 'User logged out successfully'}, status=status.HTTP_200_OK)

class CustomUsernameView(APIView):
	permission_classes = (permissions.IsAuthenticated,)
	def get(self, request):
		serializer = CustomUsernameSerializer(request.user)
		return Response({'user': serializer.data, 'success': True}, status=status.HTTP_200_OK)

class CustomUserView(APIView):
	permission_classes = (permissions.IsAuthenticated,)
	def get(self, request):
		serializer = CustomUserSerializer(request.user)
		return Response({'user': serializer.data, 'success': True},status=status.HTTP_200_OK)

class CustomUserEditView(APIView):
	permission_classes = (permissions.IsAuthenticated,)
	parser_classes = (MultiPartParser, FormParser,)
	def post(self, request):
		form = CustomUserEditForm(request.data, request.FILES, instance=request.user)
		if form.is_valid():
			form.save()
			return Response({'success': True}, status=status.HTTP_201_CREATED)
		else:
			return Response(form.errors, status=status.HTTP_400_BAD_REQUEST)

class CustomUserPasswordView(APIView):
	permission_classes = (permissions.IsAuthenticated,)
	def post(self, request):
		form = CustomUserPasswordForm(request.user, request.POST)
		if form.is_valid():
			user = form.save()
			login(request, user)
			return Response({'success': True}, status=status.HTTP_201_CREATED)
		else:
			return Response(form.errors, status=status.HTTP_400_BAD_REQUEST)

class CustomUserDeleteView(APIView):
	permission_classes = (permissions.IsAuthenticated,)
	def delete(self, request):
		user = request.user
		try:
			user.delete()
		except CustomUser.DoesNotExist:
			return Response({'error': 'User not found'}, status=status.HTTP_400_BAD_REQUEST)
		logout(request)
		return Response({'success': True}, status=status.HTTP_200_OK)


