from django.contrib import admin
from .models import UserProfile, Tag, Note


@admin.register(UserProfile)
class UserProfileAdmin(admin.ModelAdmin):
    list_display = ("id", "user", "name", "created_at", "updated_at")
    search_fields = ("user__username", "user__email", "name")
    list_filter = ("created_at", "updated_at")


@admin.register(Tag)
class TagAdmin(admin.ModelAdmin):
    list_display = ("id", "name", "color", "created_at")
    search_fields = ("name",)


@admin.register(Note)
class NoteAdmin(admin.ModelAdmin):
    list_display = ("id", "user", "title", "updated_at", "created_at")
    search_fields = ("title", "content", "user__username", "user__email")
    list_filter = ("updated_at", "created_at", "tags")
    autocomplete_fields = ("user", "tags")

# Register your models here.
