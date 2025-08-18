from rest_framework import viewsets, permissions
from rest_framework.decorators import action

from apps.institutions.models import Institution
from apps.institutions.serializers import InstitutionSerializer

# ViewSet for Institution model
class InstitutionViewSet(viewsets.ModelViewSet):
  queryset = Institution.objects.all()
  serializer_class = InstitutionSerializer
  permission_classes = [permissions.IsAuthenticatedOrReadOnly] # Allow read-only for unauthenticated

  # Get courses for a specific institution
  @action(detail=True, methods=['get'])
  def courses(self, request, pk=None):
    institution = self.get_object()
    courses = institution.courses.all()
    serializer = CourseSerializer(courses, many=True)
    return Response(serializer.data)
