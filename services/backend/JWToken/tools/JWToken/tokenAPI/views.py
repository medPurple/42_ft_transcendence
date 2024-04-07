from django.shortcuts import render
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from JWToken.vault import VaultClient
import jwt
import datetime
import pytz


# Create your views here.
class TokenAPI(APIView):
    
    @staticmethod
    def get_secret():
        vault = VaultClient()
        secret = vault.get_secret('key')
        return secret['SECRET_KEY']
        
    @staticmethod
    def generate_token(data):
        secret = TokenAPI.get_secret()
        expiration = datetime.datetime.now(pytz.utc) + datetime.timedelta(days=90)
        payload = {
            'user_id': data['user_id'],
            'expiration': expiration}
        token = jwt.encode(payload, secret, algorithm='HS256')
        return 'Bearer ' + token

    @staticmethod
    def decrypt_token(token):
        secret = TokenAPI.get_secret()
        token = token.replace('Bearer ', '')
        try:
            payload = jwt.decode(token, secret, algorithms=['HS256'])
            return payload
        except jwt.ExpiredSignatureError:
            return None
        except jwt.InvalidTokenError:
            return None
        pass

    def post(self, request):
        data = request.data
        token = TokenAPI.generate_token(data)
        return Response({'token': token}, status=status.HTTP_201_CREATED)

    def get(self, request):
        token = request.headers.get('Authorization')
        if not token:
            return Response({'error': 'No token provided'}, status=status.HTTP_400_BAD_REQUEST)
        data = TokenAPI.decrypt_token(token)
        if not data:
            return Response({'error': 'Invalid token'}, status=status.HTTP_400_BAD_REQUEST)
        return Response(data, status=status.HTTP_200_OK)
