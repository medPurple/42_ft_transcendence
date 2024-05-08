from django.contrib import admin
from django.urls import path
from pongapp.views import GameSettingsAPI


urlpatterns = [
	path('api/game/settings/', GameSettingsAPI.as_view(), name='pongapp_settings_api'),
]
