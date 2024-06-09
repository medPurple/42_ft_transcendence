from django.urls import re_path

from . import consumers

websocket_urlpatterns = [
    re_path("ws/pong/remote/(?P<user_id>\w+)/(?P<user_name>\w+)/$", consumers.PongRemoteConsumer.as_asgi()),
<<<<<<< HEAD
    re_path("ws/pong/local/(?P<user_id>\w+)/$", consumers.PongLocalConsumer.as_asgi()),
    # re_path("ws/pong/tournament", consumers.PongTournamentConsumer.as_asgi()),
=======
    re_path("ws/pong/local", consumers.PongLocalConsumer.as_asgi()),
    re_path("ws/pong/tournament/(?P<user_id>\w+)/(?P<user1>\w+)/(?P<user2>\w+)/(?P<user3>\w+)/(?P<user4>\w+)/$", consumers.PongTournamentConsumer.as_asgi()),
>>>>>>> origin/pongLocalTournament
]
