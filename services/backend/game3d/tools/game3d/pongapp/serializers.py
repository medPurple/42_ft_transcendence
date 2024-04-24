from rest_framework.serializers import ModelSerializer
from .models import GameSettings
 
class GameSettingsSerializer(ModelSerializer):
	class Meta:
		model = GameSettings
		fields = '__all__'