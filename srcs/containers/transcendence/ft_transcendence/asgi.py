"""
ASGI config for ft_transcendence project.

It exposes the ASGI callable as a module-level variable named ``application``.

For more information on this file, see
https://docs.djangoproject.com/en/5.0/howto/deployment/asgi/
"""

import os
from django.core.asgi import get_asgi_application
from channels.routing import ProtocolTypeRouter, URLRouter
from channels.auth import AuthMiddlewareStack
from game.routing import websocket_urlpatterns as game_websocket_urlpatterns
from tournament.routing import websocket_urlpatterns as tournament_websocket_urlpatterns

 


os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'ft_transcendence.settings')
application = ProtocolTypeRouter({
    "http": get_asgi_application(),
    "websocket": AuthMiddlewareStack(
        URLRouter(
            game_websocket_urlpatterns + tournament_websocket_urlpatterns
        )
    ),
    })

# import os
# from django.core.asgi import get_asgi_application
# from channels.routing import ProtocolTypeRouter, URLRouter
# from channels.auth import AuthMiddlewareStack
# from yourapp import routing  # Replace with your app's routing module

# os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'ft_transcendence.settings')

# application = ProtocolTypeRouter({
#     "http": get_asgi_application(),
#     # Add WebSocket handler here
#     "websocket": AuthMiddlewareStack(
#         URLRouter(
#             routing.websocket_urlpatterns  # Ensure this points to your WebSocket routing
#         )
#     ),
# })
