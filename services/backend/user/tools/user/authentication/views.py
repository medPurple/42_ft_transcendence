from django.contrib.auth import authenticate, login, logout
from django.contrib.auth.decorators import login_required
from django.contrib import messages
from django.contrib.auth.forms import AuthenticationForm
from django.core.files import File
from django.core.files.base import ContentFile
from django.shortcuts import render, redirect
from django.http import HttpResponse
from django.conf import settings
from rest_framework.response import Response
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from profil.serializers import CustomUserSerializer
from .forms import CustomUserCreationForm
from .models import CustomUser
import requests
import os


@api_view(['GET'])
def home(request):
	users = CustomUser.objects.all()
	serializer = CustomUserSerializer(users, many=True)
	return Response(serializer.data)

@api_view(['POST'])
def signup(request):
	if request.method == 'POST':
		form = CustomUserCreationForm(request.POST, request.FILES)
		if form.is_valid():
			user = form.save(commit=False)
			user.token = user_token(request, user.id)
			user.is_online = True
			user.save()
			login(request, user)
			return Response({'success': True}, status=201)  # Utilisez le code de statut 201 pour indiquer que la ressource a été créée avec succès
		else:
			return Response(form.errors, status=400)  # Si le formulaire n'est pas valide, renvoyez les erreurs de validation avec le code de statut 400
	else:
		return Response({'error': 'Method not allowed'}, status=405)  # Si la méthode de requête n'est pas POST, renvoyez une erreur de méthode non autorisée avec le code de statut 405

@api_view(['POST'])
def user_login(request):
	if request.method == 'POST':
		form = AuthenticationForm(request, request.POST)
		if form.is_valid():
			user = form.get_user()
			user.token = user_token(request, user.id)
			user.is_online = True
			user.save()
			login(request, user)
			return Response({'success': True},status=200)  # Utilisez le code de statut 200 pour indiquer que la connexion a réussi
		else:
			return Response(form.errors, status=400)  # Si le formulaire n'est pas valide, renvoyez les erreurs de validation avec le code de statut 400
	else:
		return Response({'error': 'Method not allowed'}, status=405)  # Si la méthode de requête n'est pas POST, renvoyez une erreur de méthode non autorisée avec le code de statut 405


def user_token(request, user_id):
	token_service_url = 'http://token:8080/api/token_generate/'
	try:
		token_response = requests.post(token_service_url, json={'user_id' : user_id})
		token_response.raise_for_status()
		user_token = token_response.json().get('token')
		return user_token
	except requests.exceptions.RequestException as e:
		print(f"Erreur lors de la connexion au service de génération de jetons : {e}")
		return None

@api_view(['POST'])
@permission_classes([IsAuthenticated])
def user_logout(request):
	if request.method == 'POST':
		user = request.user
		token_service_url = 'http://token:8080/api/token_authenticate/'
		try:
			token_response = requests.post(token_service_url, json={'token' : user.token})
			token_response.raise_for_status()
		except requests.exceptions.RequestException as e:
			print(f"Erreur lors de la connexion au service de génération de jetons : {e}")
		user.token = ''
		user.is_online = False
		user.save()
		logout(request)
		return Response(status=200)
	else:
		return Response({'error': 'Method not allowed'}, status=405)  # Si la méthode de requête n'est pas POST, renvoyez une erreur de méthode non autorisée avec le code de statut 405

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def get_user_details(request):
    user = request.user
    user_data = {
        'username': user.username,
    }
    return Response(user_data)
