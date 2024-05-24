from rest_framework.serializers import ModelSerializer
from .models import GameUser, GameSettings, GameMatch

class GameUserSerializer(ModelSerializer):
	class Meta:
		model = GameUser
		fields = '__all__'

class GameMatchSerializer(ModelSerializer):
	player1 = GameUserSerializer()
	player2 = GameUserSerializer()
	class Meta:
		model = GameMatch
		fields = '__all__'

class GameSettingsSerializer(ModelSerializer):
	user = GameUserSerializer()
	class Meta:
		model = GameSettings
		fields = '__all__'
