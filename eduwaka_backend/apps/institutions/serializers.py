from rest_framework import serializers
from apps.institutions.models import Institution
from apps.courses.serializers import CourseSerializer

class InstitutionSerializer(serializers.ModelSerializer):
  courses = CourseSerializer(many=True, read_only=True)

  class Meta:
    model = Institution
    fields = '__all__'