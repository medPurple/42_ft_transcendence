from typing import Any
from django.shortcuts import render
from django.db.models import F
from rest_framework import viewsets, status
from rest_framework.response import Response
from rest_framework.views import APIView
from .models import WaitingModel
from .serializers import WaitingModelSerializer
from django.shortcuts import get_object_or_404
from rest_framework.decorators import action

# Create your views here.


pong_waitinglist = []
tpong_waitinglist = []
pkm_waitinglist = []


class WaitingAPI(APIView):
    serializer_class = WaitingModelSerializer

    def post(self, request, *args, **kwargs):
        serializer = self.serializer_class(data=request.data)
        if serializer.is_valid():   
            game = serializer.validated_data.get('game')     
            match game:
                case ("pkm_multiplayer"):
                    serializer.validated_data['position'] = len(pkm_waitinglist) + 1
                    instance = serializer.save()
                    pkm_waitinglist.append(instance)
                case ("pong_multiplayer"):
                    serializer.validated_data['position'] = len(pong_waitinglist) + 1
                    instance = serializer.save()
                    pong_waitinglist.append(instance)
                case ("pong_tournament"):
                    serializer.validated_data['position'] = len(tpong_waitinglist) + 1
                    instance = serializer.save()
                    tpong_waitinglist.append(instance)
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    def get(self, request, *args, **kwargs):
        game = request.query_params.get('game')
        user = request.query_params.get('userID')
        
        if game is not None:
            match game:
                case ("pkm_multiplayer"):
                    pkm_waitinglist = WaitingModel.objects.filter(game="pkm_multiplayer").order_by('position')
                    serializer = WaitingModelSerializer(pkm_waitinglist, many=True)
                    return Response(serializer.data, status=status.HTTP_200_OK)
                case ("pong_multiplayer"):
                    pong_waitinglist = WaitingModel.objects.filter(game="pong_multiplayer").order_by('position')
                    serializer = WaitingModelSerializer(pong_waitinglist, many=True)
                    return Response(serializer.data, status=status.HTTP_200_OK)
                case ("pong_tournament"):
                    tpong_waitinglist = WaitingModel.objects.filter(game="pong_tournament").order_by('position')
                    serializer = WaitingModelSerializer(tpong_waitinglist, many=True)
                    return Response(serializer.data, status=status.HTTP_200_OK)
        elif user is not None:
            instance = get_object_or_404(WaitingModel, userID=user)
            serializer = WaitingModelSerializer(instance)
            return Response(serializer.data, status=status.HTTP_200_OK)
        
        all_queues = WaitingModel.objects.all().order_by('position')
        serializer = WaitingModelSerializer(all_queues, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)
    
    def delete(self, request, *args, **kwargs):
        user_id = request.query_params.get('userID')
        if user_id is not None:
            instance = get_object_or_404(WaitingModel, userID=user_id)
            game = instance.game
            position = instance.position
            instance.delete()
            WaitingModel.objects.filter(game=game, position__gt=position).update(position=F('position') - 1)
            return Response(status=status.HTTP_204_NO_CONTENT)
        return Response({"error": "userID parameter is required"}, status=status.HTTP_400_BAD_REQUEST)
                
        
