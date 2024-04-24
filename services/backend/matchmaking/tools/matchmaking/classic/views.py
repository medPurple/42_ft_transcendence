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
                    pkm = WaitingModel.objects.filter(game="pkm_multiplayer").order_by('position')
                    serializer = WaitingModelSerializer(pkm, many=True)
                    return Response(serializer.data, status=status.HTTP_200_OK)
                case ("pong_multiplayer"):
                    pong = WaitingModel.objects.filter(game="pong_multiplayer").order_by('position')
                    serializer = WaitingModelSerializer(pong, many=True)
                    return Response(serializer.data, status=status.HTTP_200_OK)
                case ("pong_tournament"):
                    tpong = WaitingModel.objects.filter(game="pong_tournament").order_by('position')
                    serializer = WaitingModelSerializer(tpong, many=True)
                    return Response(serializer.data, status=status.HTTP_200_OK)
        elif user is not None:
            self.check_waitinglist(user, game)
            if instance.match_ready:
                paired_with = self.get_paired_with(instance.position, game)
                if instance.position == 1:
                    game.remove(instance)
                    instance.delete()
                    return Response({"message": "match_ready", "paired_with": paired_with, "sender": "true"}, status=status.HTTP_200_OK)
                else:
                    game.remove(instance)
                    instance.delete()
                    return Response({"message": "match_ready", "paired_with": paired_with, "sender": "false"}, status=status.HTTP_200_OK)
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
            match instance.game:
                case ("pkm_multiplayer"):
                    pkm_waitinglist.remove(instance)
                    instance.delete()
                    users = WaitingModel.objects.filter(game="pkm_multiplayer")
                    for user in users:
                        user.position - 1
                        user.save
                case ("pong_multiplayer"):
                    pong_waitinglist.remove(instance)
                    instance.delete()
                    users = WaitingModel.objects.filter(game="pong_multiplayer")
                    for user in users:
                        user.position - 1
                        user.save
                case ("pong_tournament"):
                    tpong_waitinglist.remove(instance)
                    instance.delete()
                    users = WaitingModel.objects.filter(game="pong_tournament")
                    for user in users:
                        user.position - 1
                        user.save
            return Response(status=status.HTTP_204_NO_CONTENT)
        return Response({"error": "userID parameter is required"}, status=status.HTTP_400_BAD_REQUEST)
    
    def check_waitinglist(self, user, game):
        instance = get_object_or_404(WaitingModel, userID=user)
        match game:
            case ("pkm_multiplayer"):
                if (instance.position == 1 or instance.position == 2) and pkm_waitinglist.count() > 2:
                    instance.match_ready = True
                    instance.save()
                    return
            case ("pong_multiplayer"):
                if (instance.position == 1 or instance.position == 2) and pong_waitinglist.count() > 2:
                    instance.match_ready = True
                    instance.save()
                    return
            case ("pong_tournament"):
                if (instance.position == 1 or instance.position == 2) and tpong_waitinglist.count() > 2:
                    instance.match_ready = True
                    instance.save()
                    return
    
    def get_paired_with(self, position, game):
        match game:
            case ("pkm_multiplayer"):
                if position == 1:
                    return pkm_waitinglist[1].userID
                return pkm_waitinglist[0].userID
            case ("pong_multiplayer"):
                if position == 1:
                    return pong_waitinglist[1].userID
                return pong_waitinglist[0].userID
            case ("pong_tournament"):
                if position == 1:
                    return tpong_waitinglist[1].userID
                return tpong_waitinglist[0].userID

        