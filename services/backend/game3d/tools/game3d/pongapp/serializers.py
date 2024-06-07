from rest_framework.serializers import ModelSerializer, Serializer
from rest_framework import serializers
from .models import GameUser, GameSettings, GameMatch

class GameUserSerializer(ModelSerializer):
	class Meta:
		model = GameUser
		fields = '__all__'

class GameMatchSerializer(ModelSerializer):
	player1 = GameUserSerializer()
	player2 = GameUserSerializer()
	date = serializers.DateTimeField(read_only=True)
	class Meta:
		model = GameMatch
		fields = '__all__'

class GameSettingsSerializer(ModelSerializer):
	user = GameUserSerializer()
	class Meta:
		model = GameSettings
		fields = '__all__'
