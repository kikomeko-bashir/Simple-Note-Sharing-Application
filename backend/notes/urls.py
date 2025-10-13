from django.urls import path, include
from rest_framework.routers import DefaultRouter

from .views import NoteViewSet, TagViewSet


router = DefaultRouter()
router.register(r'notes', NoteViewSet, basename='notes')
router.register(r'tags', TagViewSet, basename='tags')


urlpatterns = [
    path('', include(router.urls)),
]

