from rest_framework import serializers


class TokenSerializer(serializers.Serializer):
    user_id = serializers.IntegerField()
