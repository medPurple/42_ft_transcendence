from rest_framework.serializers import ModelSerializer
from .models import GameSettings, UserHistory
 
class GameSettingsSerializer(ModelSerializer):
	class Meta:
		model = GameSettings
		fields = '__all__'

class UserHistorySerializer(ModelSerializer):
	class Meta:
		model = UserHistory
		fields = '__all__'

