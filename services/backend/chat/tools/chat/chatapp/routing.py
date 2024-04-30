from django.urls import re_path
from . import consumers

websocket_urlpatterns = [
	re_path("api/wschat/", consumers.ChatConsumer.as_asgi())
]
