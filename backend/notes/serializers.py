from rest_framework import serializers

from .models import Tag, Note


class MinimalUserSerializer(serializers.ModelSerializer):
    class Meta:
        model = Note._meta.get_field('user').remote_field.model
        fields = ("id", "email", "username")


class TagSerializer(serializers.ModelSerializer):
    class Meta:
        model = Tag
        fields = ("id", "name", "color", "created_at")


class NoteSerializer(serializers.ModelSerializer):
    tags = TagSerializer(many=True, read_only=True)
    tag_ids = serializers.PrimaryKeyRelatedField(
        many=True, write_only=True, queryset=Tag.objects.all(), required=False, source="tags"
    )
    user = MinimalUserSerializer(read_only=True)

    class Meta:
        model = Note
        fields = (
            "id",
            "title",
            "content",
            "tags",
            "tag_ids",
            "user",
            "created_at",
            "updated_at",
        )
        read_only_fields = ("created_at", "updated_at")

    def create(self, validated_data):
        tags = validated_data.pop("tags", [])
        note = Note.objects.create(**validated_data)
        if tags:
            note.tags.set(tags)
        return note

    def update(self, instance, validated_data):
        tags = validated_data.pop("tags", None)
        for attr, value in validated_data.items():
            setattr(instance, attr, value)
        instance.save()
        if tags is not None:
            instance.tags.set(tags)
        return instance

