from django.urls import path , include
from .views import *
from . import views
from rest_framework import routers
from django.urls import path, include




urlpatterns = [
    path('login/', views.login),
    path('signup/', views.signup),
    path('logout/', views.logout),
    path('test/', views.TestView),
]
