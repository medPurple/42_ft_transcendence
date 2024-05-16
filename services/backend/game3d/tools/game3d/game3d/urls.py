from django.contrib import admin
from django.urls import path
from pongapp.views import GameSettingsAPI


urlpatterns = [
	path('api/pong/', GameSettingsAPI.as_view(), name='pongapp_gamesettings'),
]
