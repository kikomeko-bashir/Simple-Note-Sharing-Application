from django.urls import path

from .views import RegisterView, LoginView, RefreshTokenView, VerifyTokenView, LogoutView


urlpatterns = [
    path('register/', RegisterView.as_view(), name='auth-register'),
    path('login/', LoginView.as_view(), name='auth-login'),
    path('refresh/', RefreshTokenView.as_view(), name='auth-refresh'),
    path('verify/', VerifyTokenView.as_view(), name='auth-verify'),
    path('logout/', LogoutView.as_view(), name='auth-logout'),
]

