from rest_framework.serializers import ModelSerializer
from .models import GameUser, GameSettings, GameMatch

class GameUserSerializer(ModelSerializer):
	class Meta:
		model = GameUser
		fields = '__all__'
 
class GameSettingsSerializer(ModelSerializer):
	class Meta:
		model = GameSettings
		fields = '__all__'
		read_only_fields = ['user']

class GameMatchSerializer(ModelSerializer):
	class Meta:
		model = GameMatch
		fields = '__all__'
