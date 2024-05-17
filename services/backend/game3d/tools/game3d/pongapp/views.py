from rest_framework import status
from rest_framework.views import APIView
from rest_framework.response import Response
from .models import GameSettings, UserHistory
from .serializers import GameSettingsSerializer, UserHistorySerializer


class GameSettingsAPI(APIView):
	def get(self, request, user_id):
		if user_id is None:
			return Response ({"error" : "User ID is required"}, status=status.HTTP_400_BAD_REQUEST)

		settings = GameSettings.objects.filter(user_id=user_id)
		serializer = GameSettingsSerializer(settings, many=True)
		return Response(serializer.data)

	def post(self, request, user_id):
		if user_id is None:
			return Response ({"error" : "User ID is required"}, status=status.HTTP_400_BAD_REQUEST)

		data = request.data
		data['user_id'] = user_id
		serializer = GameSettingsSerializer(data=data)

		if serializer.is_valid():
			serializer.save()
			return Response(serializer.data, status=status.HTTP_201_CREATED)
		return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

	def put(self, request, pk, user_id):
		if user_id is None:
			return Response ({"error" : "User ID is required"}, status=status.HTTP_400_BAD_REQUEST)
		
		try:
			settings = GameSettings.objects.get(pk=pk, user_id=user_id)
		except GameSettings.DoesNotExist:
			return Response ({"error" : "Game Settings not found for this user"}, status=status.HTTP_404_NOT_FOUND)
		
		serializer = GameSettingsSerializer(settings, data=request.data)

		if serializer.is_valid():
			serializer.save()
			return Response(serializer.data)
		return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

	def delete(self, request, pk, user_id):
		if user_id is None:
			return Response ({"error" : "User ID is required"}, status=status.HTTP_400_BAD_REQUEST)

		try:
			settings = GameSettings.objects.get(pk=pk, user_id=user_id)
		except GameSettings.DoesNotExist:
			return Response ({"error" : "Game Settings not found for this user"}, status=status.HTTP_404_NOT_FOUND)
		
		settings.delete()
		return Response(status=status.HTTP_204_NO_CONTENT)

class UserHistoryAPI(APIView):
	def get(self, request, user_id):
		if user_id is None:
			return Response ({"error" : "User ID is required"}, status=status.HTTP_400_BAD_REQUEST)

		history = UserHistory.objects.filter(user_id=user_id)
		serializer = UserHistorySerializer(history, many=True)
		return Response(serializer.data)

	def post(self, request, user_id):
		if user_id is None:
			return Response ({"error" : "User ID is required"}, status=status.HTTP_400_BAD_REQUEST)

		data = request.data
		data['user_id'] = user_id
		serializer = UserHistorySerializer(data=data)

		if serializer.is_valid():
			serializer.save()
			return Response(serializer.data, status=status.HTTP_201_CREATED)
		return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

	def put(self, request, pk, user_id):
		if user_id is None:
			return Response ({"error" : "User ID is required"}, status=status.HTTP_400_BAD_REQUEST)
		
		try:
			history = UserHistory.objects.get(pk=pk, user_id=user_id)
		except UserHistory.DoesNotExist:
			return Response ({"error" : "User History not found for this user"}, status=status.HTTP_404_NOT_FOUND)
		
		serializer = UserHistorySerializer(history, data=request.data)

		if serializer.is_valid():
			serializer.save()
			return Response(serializer.data)
		return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

	def delete(self, request, pk, user_id):
		if user_id is None:
			return Response ({"error" : "User ID is required"}, status=status.HTTP_400_BAD_REQUEST)

		try:
			history = UserHistory.objects.get(pk=pk, user_id=user_id)
		except UserHistory.DoesNotExist:
			return Response ({"error" : "User History not found for this user"}, status=status.HTTP_404_NOT_FOUND)
		
		history.delete()
		return Response(status=status.HTTP_204_NO_CONTENT)

