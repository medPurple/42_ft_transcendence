from typing import Any
from django.shortcuts import render
from rest_framework import viewsets, status
from rest_framework.response import Response
from .models import WaitingModel
from .serializers import WaitingModelSerializer
# Create your views here.


class WaitingAPI(viewsets.ModelViewSet):
    serializer_class = WaitingModelSerializer
    queryset = WaitingModel.objects.all()

    def __init__(self, *args,**kwargs):
        super().__init__(*args,**kwargs)
        self.pong_waitinglist = []
        self.tpong_waitinglist = []
        self.pkm_waitinglist = []
        self.pkm_position = 1
        self.pong_position = 1
        self.tpong_position = 1

    def create(self, request, *args, **kwargs):
        serializer = WaitingModelSerializer(data=request.data)
        if serializer.is_valid():   
            game = serializer.validated_data.get('game')     
            match game:
                case ("pkm_multiplayer"):
                    serializer.validated_data['position'] = self.pkm_position
                    self.pkm_position += 1
                    instance = serializer.save()
                    self.pkm_waitinglist.append(instance)
                case ("pong_multiplayer"):
                    serializer.validated_data['position'] = self.pong_position
                    self.pong_position += 1
                    instance = serializer.save()
                    self.pong_waitinglist.append(instance)
                case ("pong_tournament"):
                    serializer.validated_data['position'] = self.tpong_position
                    self.tpong_position += 1
                    instance = serializer.save()
                    self.tpong_waitinglist.append(instance)
            return Response(serializer.data, status=200)
        else :
            Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
