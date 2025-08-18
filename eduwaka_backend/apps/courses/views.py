from rest_framework import viewsets, permissions
from rest_framework.decorators import action

from apps.courses.models import Course
from apps.courses.serializers import CourseSerializer

# ViewSet for Course model
class CourseViewSet(viewsets.ModelViewSet):
  queryset = Course.objects.all()
  serializer_class = CourseSerializer
  permission_classes = [permissions.IsAuthenticatedOrReadOnly]