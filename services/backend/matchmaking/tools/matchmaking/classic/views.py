from rest_framework.views import APIView
from rest_framework.response import Response
import logging
import json
from .models import WaitingModel
from .serializers import WaitingModelSerializer
from .consumers import pokemon_queue, pong_queue

logger = logging.getLogger(__name__)
class MMAPI(APIView):
    def get(self, request):
        waiting_objects = WaitingModel.objects.all()
        serializer = WaitingModelSerializer(waiting_objects, many=True)
        data = {
            'serializer_data': serializer.data,
            'pokemon_queue': [WaitingModelSerializer(item).data for item in pokemon_queue],
            'pong_queue': [WaitingModelSerializer(item).data for item in pong_queue],
        }
        return Response(data)
    
    def put(self, request):
        data = request.data
        try:
            userexist = WaitingModel.objects.get(userID=data['userID'])
            userexist.status = data['status']
            userexist.save()
        except Exception as e:
            logger.info(e)
            pass
        return Response({'status': 'ok'})
    
    def delete(self, request):
        data = request.data
        try:
            userexist = WaitingModel.objects.get(userID=data['userID'])
            if userexist.game == 'pokemon_multiplayer' and userexist in pokemon_queue:
                pokemon_queue.remove(userexist)
            elif userexist.game == 'pong_multiplayer' and userexist in pong_queue:
                pong_queue.remove(userexist)
            userexist.delete()
        except Exception as e:
            logger.info(e)
            pass
        return Response({'status': 'ok'})