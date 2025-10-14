from rest_framework import viewsets, permissions, filters
from rest_framework.response import Response
from rest_framework.pagination import PageNumberPagination
from django_filters.rest_framework import DjangoFilterBackend
from django.conf import settings
from django.db.models import Q
try:
    # Optional: available when using PostgreSQL
    from django.contrib.postgres.search import SearchVector, SearchQuery, SearchRank
    POSTGRES_SEARCH_AVAILABLE = True
except Exception:
    POSTGRES_SEARCH_AVAILABLE = False

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
    # Filters: allow filtering by author id/username and (legacy) tag name
    filterset_fields = ["user__id", "user__username", "tags__name"]
    # Basic search fallback (when not using Postgres full-text)
    search_fields = ["title", "content", "tags__name"]
    ordering_fields = ["title", "updated_at", "created_at"]
    ordering = ["-updated_at"]
    throttle_scope = 'notes'
    
    class NotePagination(PageNumberPagination):
        page_size = 20
        page_size_query_param = "page_size"
        max_page_size = 100
    
    pagination_class = NotePagination

    def get_queryset(self):
        # Base queryset
        queryset = Note.objects.select_related("user").prefetch_related("tags")
        
        # Advanced search: Prefer PostgreSQL full-text search if available and configured
        query = self.request.query_params.get("q")
        if query:
            use_pg = getattr(settings, "USE_POSTGRES", False) and POSTGRES_SEARCH_AVAILABLE
            if use_pg:
                vector = (
                    SearchVector("title", weight="A") +
                    SearchVector("content", weight="B")
                )
                search_query = SearchQuery(query)
                queryset = (
                    queryset
                    .annotate(search=vector)
                    .annotate(rank=SearchRank(vector, search_query))
                    .filter(search=search_query)
                    .order_by("-rank", "-updated_at")
                )
            else:
                # Fallback to icontains filter across key fields
                queryset = queryset.filter(
                    Q(title__icontains=query) |
                    Q(content__icontains=query)
                ).order_by("-updated_at")
        
        return queryset

    def perform_create(self, serializer):
        serializer.save(user=self.request.user)


class TagViewSet(viewsets.ModelViewSet):
    serializer_class = TagSerializer
    permission_classes = (permissions.IsAuthenticated,)
    queryset = Tag.objects.all().order_by("name")
    search_fields = ["name"]

# Create your views here.
