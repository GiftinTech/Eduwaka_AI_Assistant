from django.shortcuts import render
# import google.generativeai as genai
from rest_framework import viewsets, permissions, status
from rest_framework.response import Response
from rest_framework.decorators import action
from rest_framework.views import APIView
from .models import Institution, Course, UserProfile
from .serializers import InstitutionSerializer, CourseSerializer, UserProfileSerializer
from django.contrib.auth import get_user_model
from django.conf import settings
import json

User = get_user_model()

# # Configure Gemini API with the key from settings
# genai.configure(api_key=settings.GEMINI_API_KEY)
# model = genai.GenerativeModel("gemini-2.0-flash") # Or "gemini-1.5-flash"

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

# ViewSet for Course model
class CourseViewSet(viewsets.ModelViewSet):
  queryset = Course.objects.all()
  serializer_class = CourseSerializer
  permission_classes = [permissions.IsAuthenticatedOrReadOnly]

# ViewSet for UserProfile (read/update own profile)
class UserProfileViewSet(viewsets.ReadOnlyModelViewSet):
  queryset = UserProfile.objects.all()
  serializer_class = UserProfileSerializer
  permission_classes = [permissions.IsAuthenticated]

  def get_queryset(self):
    # Allow users to only see/edit their own profile
    if self.request.user.is_authenticated:
      return UserProfile.objects.filter(id=self.request.user.id)
    return UserProfile.objects.none()

  @action(detail=False, methods=['get', 'put'])
  def me(self, request):
    if request.method == 'GET':
      serializer = self.get_serializer(request.user)
      return Response(serializer.data)
    elif request.method == 'PUT':
      serializer = self.get_serializer(request.user, data=request.data, partial=True)
      serializer.is_valid(raise_exception=True)
      serializer.save()
      return Response(serializer.data)

class EligibilityCheckAPIView(APIView):
  permission_classes = [permissions.IsAuthenticated] # Only authenticated users can use this

  def post(self, request, *args, **kwargs):
    # Extract data from the frontend request
    institution_name = request.data.get('institution_name')
    desired_course = request.data.get('desired_course')
    o_level_sittings = request.data.get('o_level_sittings')
    o_level_sitting_1 = request.data.get('o_level_sitting_1')
    o_level_sitting_2 = request.data.get('o_level_sitting_2')
    jamb_score = request.data.get('jamb_score')
    jamb_subjects = request.data.get('jamb_subjects')

    if not all([institution_name, desired_course, o_level_sittings, o_level_sitting_1, jamb_score, jamb_subjects]):
      return Response({"detail": "Missing required fields."}, status=status.HTTP_400_BAD_REQUEST)