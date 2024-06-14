from rest_framework import status
from rest_framework.views import APIView
from rest_framework.response import Response
from django.shortcuts import get_object_or_404
from django.db.models import Q
from .models import GameUser, GameSettings, GameMatch
from .serializers import GameUserSerializer, GameSettingsSerializer, GameMatchSerializer
import logging

logger = logging.getLogger(__name__)

class GameSettingsAPI(APIView):
	def post(self, request):
		# logger.info(f'User ID: {user_id}')
		user_id = request.data.get('userID')
		user_name = request.data.get('userName')
		if not user_id:
			return Response({"error": "User ID is required"}, status=status.HTTP_400_BAD_REQUEST)

		try:
			user, _ = GameUser.objects.get_or_create(userID=user_id, userName=user_name)
		except GameUser.DoesNotExist:
			return Response({"error": "User not found"}, status=status.HTTP_400_BAD_REQUEST)

		game_settings, created = GameSettings.objects.get_or_create(
			user=user,
			defaults={
				"scene": 3,
				"ball": 1,
				"paddle": 3,
				"table": 2,
				"score": 7,
				"powerups": False
			}
		)

		settings_serializer = GameSettingsSerializer(game_settings)
		return Response(settings_serializer.data, status=status.HTTP_201_CREATED)

	def get(self, request, user_id=None):
		# logger.info(f'User ID: {user_id}')
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
		# logger.info(f'User ID: {user_id}')
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
			return Response({'success' : True}, status=status.HTTP_200_OK)
		return Response(settings_serializer.errors, status=status.HTTP_400_BAD_REQUEST)
	
	def delete(self, request):
		# logger.info(f'User ID: {user_id}')
		user_id = request.data.get('userID')
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

		game_settings.delete()
		user.delete()
		return Response(status=status.HTTP_204_NO_CONTENT)

class GameUserAPI(APIView):
	def get(self, request, user_id=None):
		# logger.info(f'User ID: {user_id}')
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
		# logger.info(f'User ID: {user_id}')
		user_serializer = GameUserSerializer(data=request.data)
		if user_serializer.is_valid():
			user_serializer.save()
			return Response(user_serializer.data, status=status.HTTP_201_CREATED)
		return Response(user_serializer.errors, status=status.HTTP_400_BAD_REQUEST)

	def put(self, request, user_id=None):
		# logger.info(f'User ID: {user_id}')
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

class GameMatchAPI(APIView):
	# def post(self, request):
		# # logger.info(f'Match ID: {match_id}')
		# player1 = request.data.get('player1')
		# player2 = request.data.get('player2')
		
		# try:
		# 	user1 = get_object_or_404(GameUser, userID=player1.get("id"))
		# 	user2 = get_object_or_404(GameUser, userID=player2.get("id"))
		# except Exception as e:
		# 	return Response({"error": "User not found"}, status=status.HTTP_400_BAD_REQUEST)
		# match1, match1_created = GameMatch.objects.get_or_create(
		# 	player1=user1,
		# 	player2=user2,
		# 	defaults={
		# 		"player1_score": 0,
		# 		"player2_score": 0,
		# 		"status": 0,
		# 	}
		# )
		# match2, match2_created = GameMatch.objects.get_or_create(
		# 	player1=user2,
		# 	player2=user1,
		# 	defaults={
		# 		"player1_score": 0,
		# 		"player2_score": 0,
		# 		"status": 0,
		# 	}
		# )
		# if (match1_created and match2_created):
		# 	match2.delete()
		# 	match_serializer = GameMatchSerializer(match1)
		# 	return Response(match_serializer.data, status=status.HTTP_201_CREATED)
		# elif (match1_created and not match2_created):
		# 	match1.delete()
		# 	match_serializer = GameMatchSerializer(match2)
		# 	return Response(match_serializer.data, status=status.HTTP_201_CREATED)
		# elif (not match1_created and match2_created):
		# 	match2.delete()
		# 	match_serializer = GameMatchSerializer(match1)
		# 	return Response(match_serializer.data, status=status.HTTP_201_CREATED)
		# return Response({"error": "error"}, status=status.HTTP_400_BAD_REQUEST)

	# def get(self, request, match_id=None):
	# 	# logger.info(f'Match ID: {match_id}')
	# 	if match_id:
	# 		try:
	# 			game_match = GameMatch.objects.get(id=match_id)
	# 			match_serializer = GameMatchSerializer(game_match)
	# 			return Response(match_serializer.data, status=status.HTTP_200_OK)
	# 		except GameMatch.DoesNotExist:
	# 			return Response({"error": "Match not found"}, status=status.HTTP_404_NOT_FOUND)

	# 	else:
	# 		game_matches = GameMatch.objects.all()
	# 		match_serializer = GameMatchSerializer(game_matches, many=True)
	# 		return Response(match_serializer.data, status=status.HTTP_200_OK)

	def get(self, request, user_id=None):
		# logger.info(f'Match ID: {match_id}')
		if user_id:
			try:
				user = get_object_or_404(GameUser, userID=user_id)
				matches = GameMatch.objects.filter(Q(player1=user) | Q(player2=user), status=1).order_by('-date')
				data = self.formatData(matches, user)
				return Response({'success': True, 'data': data}, status=status.HTTP_200_OK)
			except Exception as e:
				return Response({"error": str(e)}, status=status.HTTP_400_BAD_REQUEST)

		else:
			game_matches = GameMatch.objects.all()
			match_serializer = GameMatchSerializer(game_matches, many=True)
			return Response(match_serializer.data, status=status.HTTP_200_OK)

	def put(self, request, match_id=None):
		# logger.info(f'Match ID: {match_id}')
		if not match_id:
			return Response({"error: Match ID not found"}, status=status.HTTP_400_BAD_REQUEST)

		try:
			game_match = GameMatch.objects.get(id=match_id)
		except GameMatch.DoesNotExist:
			return Response({"error": "Match not found"}, status=status.HTTP_404_NOT_FOUND)
		
		match_serializer = GameMatchSerializer(game_match, data=request.data, partial=True)
		if match_serializer.is_valid():
			match_serializer.save()
			return Response(match_serializer.data, status=status.HTTP_200_OK)
		return Response(match_serializer.errors, status=status.HTTP_400_BAD_REQUEST)
	
	def delete(self, request, match_id=None):
		# logger.info(f'Match ID: {match_id}')
		if not match_id:
			return Response({"error": "Match ID is required"}, status=status.HTTP_400_BAD_REQUEST)

		try:
			game_match = GameMatch.objects.get(id=match_id)
		except GameMatch.DoesNotExist:
			return Response({"error": "Match not found"}, status=status.HTTP_404_NOT_FOUND)

		game_match.delete()
		return Response(status=status.HTTP_204_NO_CONTENT)

	def formatData(self, matches, user):
		data = {
			'username': user.userName,
			'id': user.userID,
			'game_won': user.gamesWon,
			'game_lost': user.gamesLost,
			'game_played': user.gamesPlayed,
			'history': {}
		}
		for match in matches:
			data['history'][match.id] = {
				'date': match.date,
				'player1': {
					'id': match.player1.userID,
					'username': match.player1.userName,
					'score': match.player1_score
				},
				'player2': {
					'id': match.player2.userID,
					'username': match.player2.userName,
					'score': match.player2_score
				}
			}
		return data


# {
# 	username:
# 	id:
# 	game_win:
# 	game_lost:
# 	game_played:
# 	history{
# 		game1{
# 			date:
# 			player1{
# 				id:
# 				username:
# 				score:
# 			}
# 			player2{
# 				id:
# 				username:
# 				score:
# 			}
# 		game2{
# 			player1{
# 				id:
# 				username:
# 				score:
# 			}
# 			player2{
# 				id:
# 				username:
# 				score:
# 			}
# 		}
# }
