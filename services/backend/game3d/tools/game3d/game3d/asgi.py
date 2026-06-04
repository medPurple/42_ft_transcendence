import os
from channels.auth import AuthMiddlewareStack
from channels.routing import ProtocolTypeRouter, URLRouter
from django.core.asgi import get_asgi_application

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'game3d.settings')

django_asgi_app = get_asgi_application()

from pongapp.routing import websocket_urlpatterns

# AllowedHostsOriginValidator retiré — les services sont derrière nginx qui gère la sécurité.
# L'Origin vide envoyé par nginx causait un 403 systématique sur tous les WS.
application = ProtocolTypeRouter({
    "http": django_asgi_app,
    "websocket": AuthMiddlewareStack(
        URLRouter(websocket_urlpatterns)
    ),
})
