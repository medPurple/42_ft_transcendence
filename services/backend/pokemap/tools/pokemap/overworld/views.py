from django.shortcuts import render
from rest_framework import viewsets, status
from rest_framework.response import Response
from rest_framework.views import APIView
from .models import player
from django.shortcuts import get_object_or_404
from .serializers import PlayerModelSerializer


class playerAPI(APIView):
    # delete player deletion
    # put player update
    # get player info
    serializer_class = PlayerModelSerializer

    # post player creation
    def post(self, request, *args, **kwargs):
        serializer = self.serializer_class(data=request.data)
        if serializer.is_valid():
            instance = serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    def get(self, request, *args, **kwargs):
        playerid = request.query_params.get('userID')
        if playerid:
            playerobj = get_object_or_404(player, userID=playerid)
            if playerobj:
                serializer = PlayerModelSerializer(playerobj)
                return Response(serializer.data, status=status.HTTP_200_OK)
            return Response(status=status.HTTP_400_BAD_REQUEST)
        else:
            all_player = player.objects.all().order_by('userID')
            serializer = PlayerModelSerializer(all_player, many=True)
            return Response(serializer.data, status=status.HTTP_200_OK)

    def delete(self, request, *args, **kwargs):
        playerid = request.query_params.get('userID')
        if playerid is not None:
            instance = get_object_or_404(player, userID=playerid)
            if instance:
                instance.delete()
                return Response(status=status.HTTP_204_NO_CONTENT)
        return Response({"error": "userID parameter is required"}, status=status.HTTP_400_BAD_REQUEST)

 
