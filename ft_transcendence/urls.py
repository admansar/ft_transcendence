from django.contrib import admin
from django.urls import path, include 

from . import views
from rest_framework.authtoken.views import obtain_auth_token
from rest_framework_simplejwt.views import TokenObtainPairView,TokenRefreshView

urlpatterns = [
    path("admin/", admin.site.urls),
    path("accounts/", include("accounts.urls")),  # new
    path("game/", include("game.urls")),
    path('', views.home_page, name='home_page'),

]

handler404 = views.not_found_view
