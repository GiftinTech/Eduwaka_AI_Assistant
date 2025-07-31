from rest_framework import serializers
from .models import Institution, Course, UserProfile
from django.contrib.auth import get_user_model

User = get_user_model() # Get current active user

class UserProfileSerializer(serializers.ModelSerializer):
  class Meta:
    model = UserProfile
    fields = ('id', 'username', 'email', 'first_name', 'last_name')
    read_only_fields = ('username', 'email')


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