from django.contrib import admin
from django.urls import path, include 
from . import views
from rest_framework.authtoken.views import obtain_auth_token
from rest_framework_simplejwt.views import TokenObtainPairView,TokenRefreshView
from django.urls import re_path
from django.views.generic import TemplateView

urlpatterns = [
    path("admin/", admin.site.urls),
    path("api/accounts/", include("accounts.urls")),  # new
    path("game/", include("game.urls")),
    path('', views.index, name='index'),
    # path('<path:path>', views.index),
    re_path(r'^.*$', TemplateView.as_view(template_name='index.html')),

]

handler404 = views.not_found_view
