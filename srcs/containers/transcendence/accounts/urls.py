from django.urls import path
from .views import Login, SignUp , UserView, Logout , UpdateUser , Oauth42, RefreshTokenView, Me


urlpatterns = [
    path('login/', Login.as_view()),
    path('register/', SignUp.as_view()),
    path('user/', UserView.as_view()),
    path('me', Me.as_view(), name='me'),
    path('logout/', Logout.as_view()),
    path('update/', UpdateUser.as_view()),
    path('oauth42/', Oauth42.as_view()),
    path('api/auth/refresh/', RefreshTokenView.as_view(), name='refresh-expired')
]
