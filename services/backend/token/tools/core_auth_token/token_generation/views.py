from rest_framework.views import APIView
from rest_framework.response import Response
from django.conf import settings
from rest_framework import status
from drf_spectacular.utils import extend_schema, OpenApiParameter

import jwt
import os

@extend_schema(
    description="Generate a token to secure api call",
    responses={200: 'token', 405: 'Unauthorized'},
)
class TokenGenerationAPIView(APIView):
    def post(self, request):
        user_id = request.data.get('user_id')
        token = self.generate_token(user_id)
        if token:
            return Response({'token': token})
        else:
            return Response({'error': 'Unauthorized'}, status=status.HTTP_405_METHOD_NOT_ALLOWED)

    def generate_token(self, user_id):
        payload = {'user_id': user_id}
        secret = os.environ.get('SECRET_KEY')
        token = jwt.encode(payload, secret, algorithm='HS256')
        return token



