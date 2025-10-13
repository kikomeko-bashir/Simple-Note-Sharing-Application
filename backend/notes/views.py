from rest_framework import viewsets, permissions, filters
from rest_framework.response import Response
from django_filters.rest_framework import DjangoFilterBackend

from .models import Note, Tag
from .serializers import NoteSerializer, TagSerializer


class IsOwnerOrReadOnly(permissions.BasePermission):
    def has_object_permission(self, request, view, obj):
        # Read permissions are allowed for any authenticated user
        if request.method in permissions.SAFE_METHODS:
            return True
        # Write permissions only for the owner
        return getattr(obj, 'user_id', None) == getattr(request.user, 'id', None)


class NoteViewSet(viewsets.ModelViewSet):
    serializer_class = NoteSerializer
    permission_classes = (permissions.IsAuthenticated, IsOwnerOrReadOnly)
    filter_backends = [DjangoFilterBackend, filters.SearchFilter, filters.OrderingFilter]
    filterset_fields = ["tags__name"]
    search_fields = ["title", "content", "tags__name"]
    ordering_fields = ["title", "updated_at", "created_at"]
    ordering = ["-updated_at"]

    def get_queryset(self):
        # Allow everyone to view all notes
        return Note.objects.select_related("user").prefetch_related("tags")

    def perform_create(self, serializer):
        serializer.save(user=self.request.user)


class TagViewSet(viewsets.ModelViewSet):
    serializer_class = TagSerializer
    permission_classes = (permissions.IsAuthenticated,)
    queryset = Tag.objects.all().order_by("name")
    search_fields = ["name"]

# Create your views here.
