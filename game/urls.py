from django.urls import path
from django.urls import path, include
from . import views

urlpatterns = [
    path('2d', views.game_2d, name='game'),
    path('3d', views.game_3d, name='game'),
]