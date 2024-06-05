from rest_framework import serializers
from .models import player

class PlayerModelSerializer(serializers.ModelSerializer):
    posX = serializers.IntegerField(read_only=True)
    posY = serializers.IntegerField(read_only=True)
    lastPosX = serializers.IntegerField(read_only=True)
    lastPosY = serializers.IntegerField(read_only=True)
    orientation = serializers.CharField(read_only=True)
    active = serializers.BooleanField(read_only=True)
    class Meta:
        model = player
        fields = ['userID', 'posX', 'posY', 'lastPosX', 'lastPosY', 'orientation', 'active', 'player_skin', 'player_map', 'player_status']


class editplayerModelSerializer(serializers.ModelSerializer):
    class Meta:
        model = player
        fields = ['userID', 'posX', 'posY', 'lastPosX', 'lastPosY', 'orientation', 'active', 'player_skin', 'player_map', 'player_status']
        read_only_fields = ['userID']

class editplayerSkinModelSerializer(serializers.ModelSerializer):
    class Meta:
        model = player
        read_only_fields = ['userID', 'posX', 'posY', 'lastPosX', 'lastPosY', 'orientation', 'active', 'player_skin', 'player_map', 'player_status']
        fields = ['player_skin']

