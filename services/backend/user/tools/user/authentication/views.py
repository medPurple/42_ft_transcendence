from django.shortcuts import render, redirect
from .forms import CustomUserCreationForm
from django.contrib.auth import authenticate, login, logout
from django.contrib.auth.decorators import login_required
import requests
from django.contrib import messages
from django.http import HttpResponse
from django.core.files import File
from django.conf import settings
from django.core.files.base import ContentFile
import os

def home(request):
	return render(request, 'home.html')



def signup(request):
	if request.method == 'POST':
		form = CustomUserCreationForm(request.POST, request.FILES)
		if form.is_valid():
			user = form.save(commit=False)
			user.token = user_token(request, user.id)
			if user.token is not None:
				user.save()
				login(request, user)
				return redirect('home')
			else:
				messages.error(request, 'Unable to retrieve a valid token. Please try again later.')
	else:
		form = CustomUserCreationForm()
	return render(request, 'authentication/signup.html', {'form': form})


def user_login(request):
	message = ''
	if request.method == 'POST':
		username = request.POST['username']
		password = request.POST['password']
		user = authenticate(request, username=username, password=password)
		if user is not None:
			login(request, user)
			return redirect('home')
		else:
			message = 'Invalid username or password. Please try again.'
	return render(request,
		'authentication/login.html',
		context = {'message': message})


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


@login_required
def user_logout(request):
	logout(request)
	return redirect('home')

