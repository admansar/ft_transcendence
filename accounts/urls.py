from django.urls import path , include
from .views import *
from . import views
from rest_framework import routers
from django.urls import path, include
from .views import LoginView, test , RegisterView
from rest_framework import routers

router = routers.DefaultRouter()
router.register('user',views.LoginView)

urlpatterns = [

    path('',include(router.urls)),
    path('test/', test),
    path('register/',RegisterView.as_view()),
]
