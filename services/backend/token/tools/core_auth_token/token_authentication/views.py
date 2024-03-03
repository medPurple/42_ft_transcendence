from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from drf_spectacular.utils import extend_schema, OpenApiParameter
import jwt
import os


@extend_schema(
    description="Authenticate a token in a header",
    parameters=[
        OpenApiParameter(name='token', description="Token in the header"),
    ],
    responses={200: 'Authorized', 401: 'Unauthorized', 404: 'No token provided'},
)
class TokenAuthenticationAPIView(APIView):
    def get(self, request):
        token = request.headers.get('Authorization')
        if token:
            token = token.replace('Bearer ', '')
            is_valid, decoded = self.token_verification(token)
            if is_valid:
                return Response({'message': 'Token authenticated successfully'})
            else:
                return Response(decoded, status=status.HTTP_401_UNAUTHORIZED)
        else:
            return Response({'error': 'Token not provided'}, status=status.HTTP_400_BAD_REQUEST)

    def token_verification(self, token):
        try:
            secret = os.environ.get('SECRET_KEY')
            decoded = jwt.decode(token, secret, algorithms=['HS256'])
            return True, decoded
        except jwt.ExpiredSignatureError:
            return False, {'error': 'Token expired'}
        except jwt.InvalidTokenError:
            return False, {'error': 'Invalid token'}
