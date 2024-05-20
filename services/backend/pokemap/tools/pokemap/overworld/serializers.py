from rest_framework import serializers
from .models import player

class PlayerModelSerializer(serializers.ModelSerializer):
    posX = serializers.IntegerField(read_only=True)
    posY = serializers.IntegerField(read_only=True)
    orientation = serializers.CharField(read_only=True)
    active = serializers.BooleanField(read_only=True)
    event = serializers.CharField(read_only=True, default=None)
    target = serializers.CharField(read_only=True, default=None)
    class Meta:
        model = player
        fields = ['userID', 'posX', 'posY', 'orientation', 'active', 'event', 'target']


class editplayerModelSerializer(serializers.ModelSerializer):
    class Meta:
        model = player
        fields = ['userID', 'posX', 'posY', 'orientation', 'active', 'event', 'target']
        read_only_fields = ['userID']