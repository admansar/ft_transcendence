from django.urls import path
from . import views

urlpatterns = [
    path('', views.select_game, name='select_game'),
    # path('2d', views.game_2d, name='game_2d'),
    # path('3d', views.game_3d, name='game_3d'),
    # path('off_2d', views.game_2d_off, name='game_2d_off'),
]
