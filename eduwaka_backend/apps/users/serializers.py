from rest_framework import serializers
from django.contrib.auth.hashers import make_password
from django.contrib.auth import get_user_model
from django.contrib.auth.tokens import default_token_generator
from django.utils.encoding import force_str
from django.utils.http import urlsafe_base64_decode

from apps.users.models import UserProfile

User = get_user_model() # Get current active user

# Login Serializer
class LoginSerializer(serializers.Serializer):
  username = serializers.CharField(required=True)
  password = serializers.CharField(required=True, style={'input_type': 'password'})

# Serializer for User Registration
class RegisterSerializer(serializers.ModelSerializer):
  password = serializers.CharField(write_only=True, required=True, style={'input_type': 'password'})

  class Meta:
    model = UserProfile
    fields = ('id', 'username', 'email', 'password', 'first_name', 'last_name')
    extra_kwargs = {
      'first_name': {'required': True},
      'last_name': {'required': True},
      'email': {'required': True},
      'password': {'write_only': True}
    }

  def create(self, validated_data):
    validated_data['password'] = make_password(validated_data['password'])
    return super().create(validated_data)

class UserProfileSerializer(serializers.ModelSerializer):
  class Meta:
    model = UserProfile
    fields = ('id', 'username', 'email', 'first_name', 'last_name', 'photo')
    # read_only_fields = ('username', 'email')

# Change pwd 
class ChangePasswordSerializer(serializers.Serializer):
  old_password = serializers.CharField(required=True)
  new_password = serializers.CharField(required=True)
  confirm_new_password = serializers.CharField(required=True)

  def validate(self, data):
    if data['new_password'] != data['confirm_new_password']:
      raise serializers.ValidationError({"confirm_new_password": "Passwords do not match."})

    if len(data['new_password']) < 8:
      raise serializers.ValidationError({"new_password": "Passwords must be 8 characters long."})

    return data
  
# Forgot pwd
class ForgotPasswordSerializer(serializers.Serializer):
  email = serializers.EmailField()

  def validate_email(self, value):
    if not User.objects.filter(email=value).exists():
      raise serializers.ValidationError("No user is associated with this email.")
    return value
  
# Reset pwd
class ResetPasswordSerializer(serializers.Serializer):
  uidb64 = serializers.CharField()
  token = serializers.CharField()
  new_password = serializers.CharField(write_only=True)
  confirm_password = serializers.CharField(write_only=True)

  def validate(self, data):
    if data['new_password'] != data['confirm_password']:
      raise serializers.ValidationError("Passwords do not match.")
    return data

  def save(self):
    try:
      uid = force_str(urlsafe_base64_decode(self.validated_data['uidb64']))
      user = User.objects.get(pk=uid)
    except (TypeError, ValueError, OverflowError, User.DoesNotExist):
      raise serializers.ValidationError("Invalid token or user")

    if not default_token_generator.check_token(user, self.validated_data['token']):
      raise serializers.ValidationError("Token is invalid or expired")

    print("Password reset success for user:", user.username)
    user.set_password(self.validated_data['new_password'])
    user.save()
    return user


