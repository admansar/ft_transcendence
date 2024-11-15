from django.contrib import admin
from django.urls import path, include 
from . import views
from django.urls import re_path
from django.views.generic import TemplateView
from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView, TokenVerifyView
from accounts.views import RefreshTokenView

urlpatterns = [
    path("admin/", admin.site.urls),
    path("api/accounts/", include("accounts.urls")),
    path("api/game/", include("game.urls")),
    path('tournament/', include("tournament.urls")),
    # path('', views.index, name='index'),
    path('api/token', TokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('api/token/refresh', TokenRefreshView.as_view(), name='token_refresh'),
    path('api/auth/refresh/', RefreshTokenView.as_view(), name='refresh-expired'),
    path('api/token/verify/', TokenVerifyView.as_view(), name='token_verify'),
]

# handler404 = views.not_found_view
