from django.urls import path
from .views import (
    Login,
    SignUp,
    UserView,
    Logout,
    UpdateUser,
    Oauth42,
    RefreshTokenView,
    Me,
    GenerateOTPView,
    VerifyOTPView,
    GetAllUsers,
)

from rest_framework_simplejwt.views import (
    TokenVerifyView,
    TokenObtainPairView,
    TokenRefreshView,
)

urlpatterns = [
    path('api/auth/login/', Login.as_view()),
    path('api/auth/register/', SignUp.as_view()),
    path('api/auth/user/', UserView.as_view()),
    path('api/auth/me', Me.as_view(), name='me'),
    path('api/auth/logout/', Logout.as_view()),
    path('api/auth/update/', UpdateUser.as_view()),
    path('api/auth/oauth42/', Oauth42.as_view()),
    path('api/auth/refresh/', RefreshTokenView.as_view(), name='refresh-expired'),
    path('api/auth/generate-otp/', GenerateOTPView.as_view(), name='generate-otp'),
    path('api/auth/verify-otp/', VerifyOTPView.as_view(), name='verify-otp'),
    path('api/auth/token/verify/', TokenVerifyView.as_view(), name='token_verify'),
    path('api/auth/token', TokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('api/auth/refresh/', RefreshTokenView.as_view(), name='refresh-expired'),
    path('api/auth/token/refresh', TokenRefreshView.as_view(), name='token_refresh'),
    path('api/auth/user/<str:username>/', UserView.as_view(), name='user_detail'),
    path('api/auth/user/id/<int:id>/', UserView.as_view(), name='user_detail'),
    path('api/auth/users/', GetAllUsers.as_view(), name='get_all_users'),
]
