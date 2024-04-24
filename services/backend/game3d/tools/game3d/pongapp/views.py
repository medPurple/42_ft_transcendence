from rest_framework import status
from rest_framework.views import APIView
from rest_framework.response import Response
from .models import GameSettings
from .serializers import GameSettingsSerializer


class GameSettingsAPI(APIView):
	def get(self, request):
		customization_options = GameSettings.objects.all()
		serializer = GameSettingsSerializer(customization_options, many=True)
		return Response(serializer.data)

	def post(self, request):
		serializer = GameSettingsSerializer(data=request.data)
		if serializer.is_valid():
			serializer.save()
			return Response(serializer.data, status=status.HTTP_201_CREATED)
		return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

	def put(self, request, pk):
		customization_option = GameSettings.objects.get(pk=pk)
		serializer = GameSettingsSerializer(customization_option, data=request.data)
		if serializer.is_valid():
			serializer.save()
			return Response(serializer.data)
		return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

	def delete(self, request, pk):
		customization_option = GameSettings.objects.get(pk=pk)
		customization_option.delete()
		return Response(status=status.HTTP_204_NO_CONTENT)

