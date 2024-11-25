from django.urls import path
from . import views

urlpatterns = [
    path('rank/', views.RankUser.as_view(), name='rank'),
]
