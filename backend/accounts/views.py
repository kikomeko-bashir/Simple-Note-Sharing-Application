from rest_framework import generics, permissions
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView
from rest_framework_simplejwt.tokens import RefreshToken

from .serializers import RegisterSerializer, EmailOrUsernameTokenObtainPairSerializer


class RegisterView(generics.CreateAPIView):
    permission_classes = (permissions.AllowAny,)
    serializer_class = RegisterSerializer


class LoginView(TokenObtainPairView):
    permission_classes = (permissions.AllowAny,)
    serializer_class = EmailOrUsernameTokenObtainPairSerializer

    def post(self, request, *args, **kwargs):
        response = super().post(request, *args, **kwargs)
        # On success (200), append a success indicator and basic user info
        if response.status_code == 200:
            try:
                from django.contrib.auth import get_user_model
                User = get_user_model()
                email = request.data.get('email')
                username = request.data.get('username')
                user = None
                if email:
                    user = User.objects.filter(email__iexact=email).first()
                if user is None and username:
                    user = User.objects.filter(username__iexact=username).first()
                payload = response.data
                payload['success'] = True
                if user is not None:
                    payload['user'] = {
                        'id': user.id,
                        'email': user.email,
                        'username': user.username,
                    }
                response.data = payload
            except Exception:
                # If anything goes wrong, still return the original successful tokens
                pass
        return response


class RefreshTokenView(TokenRefreshView):
    permission_classes = (permissions.AllowAny,)


class VerifyTokenView(APIView):
    permission_classes = (permissions.IsAuthenticated,)

    def get(self, request):
        return Response({"detail": "Token valid", "user": {"id": request.user.id, "email": request.user.email, "username": request.user.username}})


class LogoutView(APIView):
    permission_classes = (permissions.IsAuthenticated,)

    def post(self, request):
        refresh_token = request.data.get("refresh")
        if refresh_token:
            try:
                token = RefreshToken(refresh_token)
                token.blacklist()
            except Exception:
                pass
        return Response({"detail": "Logged out"})
from django.shortcuts import render

# Create your views here.
