from django.shortcuts import render
import google.generativeai as genai
from rest_framework import viewsets, permissions, status, generics
from rest_framework.response import Response
from rest_framework.decorators import action
from rest_framework.views import APIView
from .models import Institution, Course, UserProfile
from .serializers import InstitutionSerializer, CourseSerializer, UserProfileSerializer
from django.contrib.auth import get_user_model
from django.conf import settings
import json

User = get_user_model()

# Configure Gemini API with the key from settings
genai.configure(api_key=settings.GEMINI_API_KEY)
model = genai.GenerativeModel("gemini-2.5-flash") 

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

# Get all users
class UserListViewSet(generics.ListAPIView):
  queryset = User.objects.all()
  serializer_class = UserProfileSerializer
  permission_classes = [permissions.IsAdminUser]

# Delete user
class AdminDeleteUserViewSet(APIView):
  serializer_class = UserProfileSerializer
  permission_classes = [permissions.IsAdminUser]

  def delete(self, request, user_id):
    try:
      user = User.objects.get(id=user_id)
    except User.DoesNotExist:
      return Response({"detail": "User not found"}, status=status.HTTP_404_NOT_FOUND)
    
    user.delete()
    return Response({"detail": "User deleted successfully"}, status=status.HTTP_204_NO_CONTENT)

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
    
    # Prompt for Gemini model
    o_level_results_combined = f"1st Sitting: {o_level_sitting_1}"
    if o_level_sittings == '2':
      o_level_results_combined += f"\n2nd Sitting: {o_level_sitting_2}"

    prompt = f"""Analyze the following academic credentials for eligibility to study "{desired_course}" at "{institution_name}" in a Nigerian university.
    Assume standard admission requirements for Nigerian universities, including:
    - O'Level: Minimum of 5 credits (C6 or above) in relevant subjects, including English Language and Mathematics.
      - Number of sittings accepted: {o_level_sittings}
      - Total O'Level credits required: Typically 5 credits.
    - JAMB: Score must meet or exceed the typical cut-off mark for the desired course and institution (if specified, otherwise general typical cut-off).
    - JAMB Subject Combination: Must align with the requirements for the desired course.

    O'Level Results:
    {o_level_results_combined}

    JAMB Score: {jamb_score}
    JAMB Subjects: {jamb_subjects}

    Desired Course: {desired_course}
    Institution: {institution_name}

    Provide a structured JSON response with the following fields:
    - "is_eligible": boolean (true if eligible, false otherwise)
    - "reasons": array of strings (why they are or are not eligible, covering O'Level subjects/grades, JAMB score, JAMB combination, and sittings)
    - "missing_requirements": array of strings (specific subjects/grades/scores/sittings missing)
    - "suggested_courses": array of strings (if not eligible for desired course, suggest *related or alternative* courses they might be eligible for based on their *provided O'Level and JAMB subjects*, staying within the general academic stream (e.g., Arts, Sciences, Social Sciences, Management). Avoid suggesting courses from entirely different streams if the provided subjects do not support them.)
    - "o_level_credits_required": number (e.g., 5)
    - "o_level_sittings_accepted": number (e.g., 1 or 2)

    Example JSON structure:
    {{
      "is_eligible": true,
      "reasons": ["Met all core O'Level subject requirements.", "Achieved required O'Level grades.", "JAMB score is competitive.", "JAMB subject combination is correct.", "Met sitting requirements."],
      "missing_requirements": [],
      "suggested_courses": [],
      "o_level_credits_required": 5,
      "o_level_sittings_accepted": 1
    }}
    """

    try:
      # Call the Gemini API
      response = model.generate_content(
        contents=[{"parts": [{"text": prompt}]}],
        generation_config={
          "response_mime_type": "application/json",
          "response_schema": {
            "type": "OBJECT",
            "properties": {
              "is_eligible": { "type": "BOOLEAN" },
              "reasons": { "type": "ARRAY", "items": { "type": "STRING" } },
              "missing_requirements": { "type": "ARRAY", "items": { "type": "STRING" } },
              "suggested_courses": { "type": "ARRAY", "items": { "type": "STRING" } },
              "o_level_credits_required": { "type": "NUMBER" },
              "o_level_sittings_accepted": { "type": "NUMBER" }
            },
            "propertyOrdering": ["is_eligible", "reasons", "missing_requirements", "suggested_courses", "o_level_credits_required", "o_level_sittings_accepted"]
          }
        }
      )

      # Parse the JSON response from Gemini
      gemini_output_text = response.text
      analysis_result = json.loads(gemini_output_text)

      return Response(analysis_result, status=status.HTTP_200_OK)
    except Exception as e:
      print(f"Error calling Gemini API: {e}")
      return Response({"detail": f"Error processing eligibility check: {str(e)}"}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

class ChatbotAPIView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def post(self, request, *args, **kwargs):
      chat_history = request.data.get('chat_history', [])

      if not chat_history:
        return Response({"detail": "No chat history provided."}, status=status.HTTP_400_BAD_REQUEST)

      # Convert frontend chat history format to Gemini's expected format
      gemini_chat_history = []
      for msg in chat_history:
        gemini_chat_history.append({"role": msg['role'], "parts": [{"text": msg['text']}]})

      try:
        # Start chat with history
        chat = model.start_chat(history=gemini_chat_history[:-1]) # Exclude the last (user's current) message from history for send_message
        response = chat.send_message(gemini_chat_history[-1]['parts'][0]['text']) # Send only the latest user message

        bot_reply = response.text
        return Response({"bot_reply": bot_reply}, status=status.HTTP_200_OK)

      except Exception as e:
          print(f"Error calling Gemini API for chatbot: {e}")
          return Response({"detail": f"Error processing chatbot request: {str(e)}"}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
