from django.urls import path

from .views import GameMatchAPI, GameUserAPI

urlpatterns = [
	path('api/arena/gamer/', GameUserAPI.as_view(), name='pongapp_gameuser'),
	path('api/arena/gamer/<int:user_id>/', GameUserAPI.as_view(), name='pongapp_gameuser_byID'),
	path('api/arena/match/', GameMatchAPI.as_view(), name='pongapp_gamematch'),
	path('api/arena/match/<int:user_id>/', GameMatchAPI.as_view(), name='pongapp_gamematch_byID'),
]