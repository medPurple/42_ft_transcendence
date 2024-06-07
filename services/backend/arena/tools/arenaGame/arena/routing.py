from django.urls import re_path

from .battle import Challenger

websocket_urlpatterns = [
    re_path("ws/challenger/", Challenger.as_asgi()),
]