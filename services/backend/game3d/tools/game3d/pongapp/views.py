from django.shortcuts import render
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
#from .models import GameSettings


class GameSettingsAPI(APIView):
	def get(self, request):
		game_settings = GameSettings.objects.all()
		return Response(game_settings.values()[0], status=status.HTTP_200_OK)

	def post(self, request):
		game_settings = GameSettings.objects.all()
		game_settings.update(**request.data)
		return Response(game_settings.values()[0], status=status.HTTP_200_OK)
	
	def put(self, request):
		game_settings = GameSettings.objects.all()
		game_settings.update(**request.data)
		return Response(game_settings.values()[0], status=status.HTTP_200_OK)
	
	def delete(self, request):
		game_settings = GameSettings.objects.all()
		game_settings.update(**GameSettings.DEFAULT_SETTINGS)
		return Response(game_settings.values()[0], status=status.HTTP_200_OK)
