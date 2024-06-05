from django.urls import re_path

from . import consumers

websocket_urlpatterns = [
    re_path("ws/pong/remote/(?P<user_id>\w+)/$", consumers.PongRemoteConsumer.as_asgi()),
    re_path("ws/pong/local", consumers.PongLocalConsumer.as_asgi()),
    # re_path("ws/pong/tournament", consumers.PongTournamentConsumer.as_asgi()),
]
