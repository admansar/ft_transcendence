from django.urls import path
from .views import Login, SignUp , UserView, Logout , UpdateUser

urlpatterns = [
    path('login/', Login.as_view()),
    path('signup/', SignUp.as_view()),
    path('user/', UserView.as_view()),
    path('logout/', Logout.as_view()),
    path('update/', UpdateUser.as_view())
]
