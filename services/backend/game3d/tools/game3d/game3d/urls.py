from django.contrib import admin
from django.urls import path
from pongapp.views import GameSettingsAPI, UserHistoryAPI


urlpatterns = [
	path('api/pong/settings', GameSettingsAPI.as_view(), name='pongapp_gamesettings'),
	path('api/pong/history', UserHistoryAPI.as_view(), name='pongapp_userhistory'),
]
