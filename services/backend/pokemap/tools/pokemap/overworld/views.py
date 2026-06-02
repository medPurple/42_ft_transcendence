import requests
from rest_framework import status
from rest_framework.response import Response
from rest_framework.views import APIView
from .models import player
from django.shortcuts import get_object_or_404
from .serializers import PlayerModelSerializer, editplayerModelSerializer, editplayerSkinModelSerializer
import logging

logger = logging.getLogger(__name__)


def validate_token(request):
    """Valide le token JWT. Retourne user_id si valide, None sinon."""
    auth_header = request.headers.get('Authorization')
    if not auth_header:
        return None
    try:
        response = requests.get(
            'https://JWToken:4430/api/token/',
            headers={'Authorization': auth_header}
        )
        data = response.json()
        if data.get('success') is True:
            return data.get('data', {}).get('user_id')
    except Exception as e:
        logger.warning(f"Token validation failed: {e}")
    return None

class playerAPI(APIView):
    # delete player deletion
    # put player update
    # get player info
    serializer_class = PlayerModelSerializer

    # post player creation — appelé par le service user à l'inscription (avec token)
    def post(self, request, *args, **kwargs):
        if not validate_token(request):
            return Response({'error': 'Authentication required'}, status=status.HTTP_401_UNAUTHORIZED)
        serializer = self.serializer_class(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    def get(self, request, *args, **kwargs):
        if not validate_token(request):
            return Response({'error': 'Authentication required'}, status=status.HTTP_401_UNAUTHORIZED)
        playerid = request.query_params.get('userID')
        if playerid:
            playerobj = get_object_or_404(player, userID=playerid)
            serializer = PlayerModelSerializer(playerobj)
            return Response(serializer.data, status=status.HTTP_200_OK)
        else:
            all_player = player.objects.all().order_by('userID')
            serializer = PlayerModelSerializer(all_player, many=True)
            return Response(serializer.data, status=status.HTTP_200_OK)

    def delete(self, request, *args, **kwargs):
        if not validate_token(request):
            return Response({'error': 'Authentication required'}, status=status.HTTP_401_UNAUTHORIZED)
        playerid = request.query_params.get('userID')
        if playerid is not None:
            instance = get_object_or_404(player, userID=playerid)
            instance.delete()
            return Response(status=status.HTTP_204_NO_CONTENT)
        return Response({"error": "userID parameter is required"}, status=status.HTTP_400_BAD_REQUEST)

    def put(self, request, *args, **kwargs):
        if not validate_token(request):
            return Response({'error': 'Authentication required'}, status=status.HTTP_401_UNAUTHORIZED)
        playerobj = get_object_or_404(player, userID=request.data["userID"])
        instance = editplayerModelSerializer(playerobj, data=request.data)
        if instance.is_valid():
            instance.save()
            return Response(instance.data, status=status.HTTP_200_OK)
        return Response(instance.errors, status=status.HTTP_400_BAD_REQUEST)


class editplayerskin(APIView):
    serializer_class = editplayerSkinModelSerializer

    def put(self, request, *args, **kwargs):
        if not validate_token(request):
            return Response({'error': 'Authentication required'}, status=status.HTTP_401_UNAUTHORIZED)
        playerobj = get_object_or_404(player, userID=request.data["userID"])
        instance = editplayerSkinModelSerializer(playerobj, data=request.data)
        if instance.is_valid():
            instance.save()
            return Response(instance.data, status=status.HTTP_200_OK)
        return Response(instance.errors, status=status.HTTP_400_BAD_REQUEST)