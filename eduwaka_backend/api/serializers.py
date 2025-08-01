from rest_framework import serializers
from django.contrib.auth.hashers import make_password
from .models import Institution, Course, UserProfile
from django.contrib.auth import get_user_model

User = get_user_model() # Get current active user

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
    fields = ('id', 'username', 'email', 'first_name', 'last_name')
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

class CourseSerializer(serializers.ModelSerializer):
  institution_name = serializers.CharField(source='institution.name', read_only=True)

  class Meta:
    model = Course
    fields = '__all__'

class InstitutionSerializer(serializers.ModelSerializer):
  courses = CourseSerializer(many=True, read_only=True)

  class Meta:
    model = Institution
    fields = '__all__'