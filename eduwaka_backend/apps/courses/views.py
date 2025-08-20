from rest_framework import viewsets
from rest_framework.decorators import action
from rest_framework.response import Response

from apps.courses.models import Course
from apps.courses.serializers import CourseSerializer
from core.utils import IsAdminOrReadOnly

# ViewSet for Course model
class CourseViewSet(viewsets.ModelViewSet):
  queryset = Course.objects.all()
  serializer_class = CourseSerializer
  permission_classes = [IsAdminOrReadOnly]

  def get_queryset(self):
    # Initialize queryset
    queryset = self.queryset
    
    # Get query parameters
    name = self.request.query_params.get('name')
    faculty = self.request.query_params.get('faculty')
    department = self.request.query_params.get('department')
    institution_id = self.request.query_params.get('institution')

    # Apply filters
    if name:
      queryset = queryset.filter(name__icontains=name)
    
    if faculty:
      queryset = queryset.filter(faculty__icontains=faculty)
        
    if department:
      queryset = queryset.filter(department__icontains=department)
        
    if institution_id:
      queryset = queryset.filter(institution_id=institution_id)
        
    return queryset