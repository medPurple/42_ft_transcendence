from rest_framework import serializers

class TokenSerializer(serializers.Serializer):
    user_id = serializers.CharField(max_length=255)
    expiration = serializers.DateTimeField()
