from django.shortcuts import render, redirect
from .forms import CustomUserCreationForm
from django.contrib.auth import authenticate, login, logout
from django.contrib.auth.decorators import login_required

def signup(request):
    if request.method == 'POST':
        form = CustomUserCreationForm(request.POST)
        if form.is_valid():
            form.save()
            return redirect('login')
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


def home(request):
    return render(request, 'home.html')

@login_required
def user_logout(request):
    logout(request)
    return redirect('home')


# Create your views here.
