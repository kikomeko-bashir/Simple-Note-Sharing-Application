from django.contrib.auth import get_user_model
from django.contrib.auth.password_validation import validate_password
from rest_framework import serializers, exceptions
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer


User = get_user_model()


class RegisterSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True, required=True)
    # Accept a single "name" field from the frontend and map to first_name
    name = serializers.CharField(write_only=True, required=False, allow_blank=True)

    class Meta:
        model = User
        # Username is required and must be unique (validated below)
        fields = ("id", "email", "username", "password", "first_name", "last_name", "name")
        extra_kwargs = {
            "username": {"required": True},
            "email": {"required": True}
        }

    def validate(self, attrs):
        email = attrs.get("email")
        username = attrs.get("username")
        if not email:
            raise serializers.ValidationError({"email": "Email is required"})
        # Email must be unique
        if User.objects.filter(email__iexact=email).exists():
            raise serializers.ValidationError({"email": "An account with this email already exists"})
        # Enforce unique username policy
        provided = (username or '').strip()
        if not provided:
            raise serializers.ValidationError({"username": "Username is required"})
        # Ensure provided username is unique (case-insensitive)
        if User.objects.filter(**{f"{User.USERNAME_FIELD}__iexact": provided}).exists():
            raise serializers.ValidationError({"username": "This username is already taken"})
        attrs["username"] = provided
        # Map name → first_name if provided and first_name missing
        name = attrs.pop("name", "").strip()
        if name and not attrs.get("first_name"):
            attrs["first_name"] = name
        return attrs

    def validate_password(self, value):
        validate_password(value)
        return value

    def create(self, validated_data):
        password = validated_data.pop("password")
        user = User(**validated_data)
        user.set_password(password)
        user.save()
        return user

    def to_representation(self, instance):
        # Do not expose username in the response payload
        rep = super().to_representation(instance)
        rep.pop('first_name', None)
        rep.pop('last_name', None)
        return rep


class EmailOrUsernameTokenObtainPairSerializer(TokenObtainPairSerializer):
    """Allow login with either username or email + password."""

    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)
        # Make the username field optional to prevent "username required" before validate runs
        if self.username_field in self.fields:
            self.fields[self.username_field].required = False
        # Add an optional email field
        from rest_framework import serializers as _s
        self.fields['email'] = _s.EmailField(required=False)

    def validate(self, attrs):
        # Ensure username key exists to satisfy parent serializer
        username = attrs.get('username') or self.initial_data.get('username') or ''
        email = (attrs.get('email') or self.initial_data.get('email') or '').strip()
        if email and not username:
            user = User.objects.filter(email__iexact=email).first()
            if user is not None:
                # map to expected username field
                attrs['username'] = getattr(user, User.USERNAME_FIELD, user.username)
            else:
                # Set an empty username so parent validate doesn't KeyError; will fail auth cleanly
                attrs['username'] = ''
        else:
            # Propagate username value for parent validation
            attrs['username'] = username
        return super().validate(attrs)

