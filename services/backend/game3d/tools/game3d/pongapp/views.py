from rest_framework import status
from rest_framework.views import APIView
from rest_framework.response import Response
from .models import GameUser, GameSettings, GameMatch
from .serializers import GameUserSerializer, GameSettingsSerializer, GameMatchSerializer


class GameSettingsAPI(APIView):
	def post(self, request):
		user_id = request.data.get('userID')
		if not user_id:
			return Response({"error": "User ID is required"}, status=status.HTTP_400_BAD_REQUEST)

		try:
			user, _ = GameUser.objects.get_or_create(userID=user_id)
		except GameUser.DoesNotExist:
			return Response({"error": "User not found"}, status=status.HTTP_400_BAD_REQUEST)

		game_settings, created = GameSettings.objects.get_or_create(
			user=user,
			defaults={
				"scene": "Cornfield",
				"ball": 1,
				"paddle": 1,
				"table": 1,
				"score": 11,
				"powerups": False
			}
		)

		settings_serializer = GameSettingsSerializer(game_settings)
		return Response(settings_serializer.data, status=status.HTTP_201_CREATED)

	def get(self, request, user_id=None):
		if not user_id:
			return Response({"error": "User ID is required"}, status=status.HTTP_400_BAD_REQUEST)

		try:
			user = GameUser.objects.get(userID=user_id)
		except GameUser.DoesNotExist:
			return Response({"error": "User not found"}, status=status.HTTP_404_NOT_FOUND)

		try:
			game_settings = GameSettings.objects.get(user=user)
		except GameSettings.DoesNotExist:
			return Response({"error": "Settings not found"}, status=status.HTTP_404_NOT_FOUND)

		settings_serializer = GameSettingsSerializer(game_settings)
		return Response(settings_serializer.data, status=status.HTTP_200_OK)

	def put(self, request, user_id=None):
		if not user_id:
			return Response({"error": "User ID is required"}, status=status.HTTP_400_BAD_REQUEST)
		
		try:
			user = GameUser.objects.get(userID=user_id)
		except GameUser.DoesNotExist:
			return Response({"error": "User not found"}, status=status.HTTP_404_NOT_FOUND)

		try:
			game_settings = GameSettings.objects.get(user=user)
		except GameSettings.DoesNotExist:
			return Response({"error": "Settings not found"}, status=status.HTTP_404_NOT_FOUND)

		settings_serializer = GameSettingsSerializer(game_settings, data=request.data, partial=True)
		if settings_serializer.is_valid():
			settings_serializer.save()
			return Response(settings_serializer.data, status=status.HTTP_200_OK)
		return Response(settings_serializer.errors, status=status.HTTP_400_BAD_REQUEST)

class GameMatchAPI(APIView):
	def post(self, request):
		match_serializer = GameMatchSerializer(data=request.data)
		if match_serializer.is_valid():
			match_serializer.save()
			return Response(match_serializer.data, status=status.HTTP_201_CREATED)
		return Response(match_serializer.errors, status=status.HTTP_400_BAD_REQUEST)

	def get(self, request, match_id=None):
		if match_id:
			try:
				game_match = GameMatch.objects.get(id=match_id)
				match_serializer = GameMatchSerializer(game_match)
				return Response(match_serializer.data, status=status.HTTP_200_OK)
			except GameMatch.DoesNotExist:
				return Response({"error": "Match not found"}, status=status.HTTP_404_NOT_FOUND)

		else:
			game_matches = GameMatch.objects.all()
			match_serializer = GameMatchSerializer(game_matches, many=True)
			return Response(match_serializer.data, status=status.HTTP_200_OK)

class GameUserAPI(APIView):
	def get(self, request, user_id=None):
		if user_id:
			try:
				game_user = GameUser.objects.get(userID=user_id)
				user_serializer = GameUserSerializer(game_user)
				return Response(user_serializer.data, status=status.HTTP_200_OK)
			except GameUser.DoesNotExist:
				return Response({"error": "User not found"}, status=status.HTTP_404_NOT_FOUND)
		else:
			game_users = GameUser.objects.all()
			user_serializer = GameUserSerializer(game_users, many=True)
			return Response(user_serializer.data, status=status.HTTP_200_OK)

	def post(self, request):
		user_serializer = GameUserSerializer(data=request.data)
		if user_serializer.is_valid():
			user_serializer.save()
			return Response(user_serializer.data, status=status.HTTP_201_CREATED)
		return Response(user_serializer.errors, status=status.HTTP_400_BAD_REQUEST)

	def put(self, request, user_id=None):
		if not user_id:
			return Response({"error": "User ID is required"}, status=status.HTTP_400_BAD_REQUEST)

		try:
			game_user = GameUser.objects.get(userID=user_id)
		except GameUser.DoesNotExist:
			return Response({"error": "User not found"}, status=status.HTTP_404_NOT_FOUND)

		user_serializer = GameUserSerializer(game_user, data=request.data, partial=True)
		if user_serializer.is_valid():
			user_serializer.save()
			return Response(user_serializer.data, status=status.HTTP_200_OK)
		return Response(user_serializer.errors, status=status.HTTP_400_BAD_REQUEST)

	def delete(self, request, user_id=None):
		if not user_id:
			return Response({"error": "User ID is required"}, status=status.HTTP_400_BAD_REQUEST)

		try:
			game_user = GameUser.objects.get(userID=user_id)
		except GameUser.DoesNotExist:
			return Response({"error": "User not found"}, status=status.HTTP_404_NOT_FOUND)

		game_user.delete()
		return Response(status=status.HTTP_204_NO_CONTENT)