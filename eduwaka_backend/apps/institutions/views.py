from rest_framework import viewsets, filters
from rest_framework.decorators import action
from rest_framework.response import Response
from apps.institutions.models import Institution
from apps.institutions.serializers import InstitutionSerializer
from apps.courses.serializers import CourseSerializer
from core.utils import IsAdminOrReadOnly

# ViewSet for Institution model
class InstitutionViewSet(viewsets.ModelViewSet):
  queryset = Institution.objects.all()
  serializer_class = InstitutionSerializer
  permission_classes = [IsAdminOrReadOnly] # Allow read-only for unauthenticated and authenticated. Only admin can perform CUD ops.
  filter_backends = [filters.SearchFilter]
  search_fields = ['name', 'state', 'ownership_type']

  def get_queryset(self):
    # This line initializes the queryset with all objects from the model
    queryset = self.queryset 

    # Get query parameters from the request
    name = self.request.query_params.get('name')
    state = self.request.query_params.get('state')
    city = self.request.query_params.get('city')
    institution_type_param = self.request.query_params.get('institution_type')
    ownership_type_param = self.request.query_params.get('ownership_type')
    abbreviation = self.request.query_params.get('abbreviation')

    # Apply filters if query parameters are present
    if name:
        queryset = queryset.filter(name__icontains=name)
    
    if state:
        queryset = queryset.filter(state__iexact=state)
    
    if city:
        queryset = queryset.filter(city__icontains=city)
    
    if institution_type_param:
      queryset = queryset.filter(institution_type=institution_type_param)
      
    if ownership_type_param: 
      queryset = queryset.filter(ownership_type=ownership_type_param)

    if abbreviation:
      queryset = queryset.filter(abbreviation__icontains=abbreviation)
        
    return queryset

  # Get courses for a specific institution
  @action(detail=True, methods=['get'])
  def courses(self, request, pk=None):
    institution = self.get_object()
    courses = institution.courses.all()
    serializer = CourseSerializer(courses, many=True)
    return Response(serializer.data)
