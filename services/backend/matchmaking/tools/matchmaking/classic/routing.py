from django.urls import re_path

from . import consumers

websocket_urlpatterns = [
    re_path("api/wsqueue/", consumers.QueueConsumer.as_asgi()),
]