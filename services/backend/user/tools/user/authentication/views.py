from django.shortcuts import render, redirect
from .forms import CustomUserCreationForm
from django.contrib.auth import authenticate, login, logout
from django.contrib.auth.decorators import login_required
import requests
from django.contrib import messages 
from django.http import HttpResponse

def signup(request):
	if request.method == 'POST':
		form = CustomUserCreationForm(request.POST)
		if form.is_valid():
			#verify picture
			user = form.save(commit=False)
			user.token = user_token(request)
			if user.token is not None:
				user.save()
				return redirect('login')
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
	message = 'Invalid username or password. Please try again.'
	return render(request,
		'authentication/login.html',
		context = {'message': message})


def user_token(request):
    token_service_url = 'http://127.0.0.1/api/token_generate/'
    try:
        token_response = requests.post(token_service_url)
        token_response.raise_for_status()  # Cette ligne lèvera une exception si la réponse HTTP n'est pas OK (200)

        user_token = token_response.json().get('token')
        return user_token
    except requests.exceptions.RequestException as e:
        print(f"Erreur lors de la connexion au service de génération de jetons : {e}")
        return None


def home(request):
	return render(request, 'home.html')

@login_required
def user_logout(request):
	logout(request)
	return redirect('home')


# Create your views here.
