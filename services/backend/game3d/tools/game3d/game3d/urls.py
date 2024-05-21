from django.contrib import admin
from django.urls import path
from pongapp.views import GameSettingsAPI, GameMatchAPI, GameUserAPI


urlpatterns = [
	path('admin/', admin.site.urls),
	path('api/pong/', GameSettingsAPI.as_view(), name='pongapp_gamesettings'),
	path('api/pong/<int:user_id>/', GameSettingsAPI.as_view(), name='pongapp_gamesettings_byID'),
	path('api/pong/gamer/', GameUserAPI.as_view(), name='pongapp_gameuser'),
	path('api/pong/gamer/<int:user_id>/', GameUserAPI.as_view(), name='pongapp_gameuser_byID'),
	path('api/pong/match/', GameMatchAPI.as_view(), name='pongapp_gamematch'),
	path('api/pong/match/<int:match_id>/', GameMatchAPI.as_view(), name='pongapp_gamematch_byID'),
]
