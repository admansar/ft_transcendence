from django.contrib import admin
from django.urls import path, include 

urlpatterns = [
    path("admin/", admin.site.urls),
    path("api/game/", include("game.urls")),
    path('api/tournament/', include("tournament.urls")),
    path('api/fgame/', include("friends_game.urls")),
]
