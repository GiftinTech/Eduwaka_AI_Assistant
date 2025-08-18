from rest_framework import serializers
from apps.courses.models import Course


class CourseSerializer(serializers.ModelSerializer):
  institution_name = serializers.CharField(source='institution.name', read_only=True)

  class Meta:
    model = Course
    fields = '__all__'