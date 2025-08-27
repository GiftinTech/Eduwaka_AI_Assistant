from rest_framework import permissions, status
import google.generativeai as genai
from django.conf import settings
import json

from rest_framework.response import Response
from rest_framework.views import APIView
from apps.ai_assistant.serializers import EligibilityCheckRequestSerializer, ChatbotRequestSerializer, InstitutionRequestSerializer
from .models import ChatHistory

# Configure Gemini API with the key using the settings settings
genai.configure(api_key=settings.GEMINI_API_KEY)
# Initialize the Gemini model for content generation
model = genai.GenerativeModel("gemini-2.5-flash")

# Institution Overview View
class InstitutionOverviewAPIView(APIView):
  permission_classes = [permissions.AllowAny]

  def post(self, request, *args, **kwargs):
    # Validate the incoming data using the serializer
    serializer = InstitutionRequestSerializer(data=request.data)
    serializer.is_valid(raise_exception=True)
    institution_name = serializer.validated_data['institution_name']

    # Detailed prompt for the Gemini model, requesting JSON output
    prompt = f"""
    Provide a concise overview of the Nigerian institution named "{institution_name}".
    The overview should be structured as a JSON object with the following fields:
    - "name": The full name of the institution.
    - "type": The type of institution (e.g., "Federal University", "State Polytechnic", "Private University").
    - "location": The city and state where the main campus is located.
    - "established_year": The year it was founded.
    - "overview": A brief, one-paragraph summary of the institution's history and mission.
    - "relevance": A short description of what the institution is known for (e.g., academic excellence, specific faculties, or campus life).
    
    If the institution is not a recognized Nigerian tertiary institution, return a JSON object with an "error" field.

    Example JSON response for a valid institution:
    {{
      "name": "University of Lagos",
      "type": "Federal University",
      "location": "Lagos, Lagos State",
      "established_year": 1962,
      "overview": "The University of Lagos, founded in 1962, is a leading research university. It is one of the nation's first generation universities and is known for its academic and social influence.",
      "relevance": "UNILAG is well-regarded for its business and law faculties, and is one of the most prestigious universities in Nigeria."
    }}

    Example JSON response for an invalid institution:
    {{
      "error": "The institution '{institution_name}' could not be found or is not a recognized Nigerian institution."
    }}
    """

    try:
      # Call Gemini API with the prompt
      response = model.generate_content(
        contents=[{"parts": [{"text": prompt}]}],
        generation_config={
          "response_mime_type": "application/json",
        }
      )

      # Parse the JSON response from the model
      gemini_output_text = response.text
      institution_data = json.loads(gemini_output_text)

      # Check for a specific error from the AI model
      if "error" in institution_data:
        return Response(
          {"detail": institution_data["error"]},
          status=status.HTTP_404_NOT_FOUND
        )

      return Response(institution_data, status=status.HTTP_200_OK)

    except json.JSONDecodeError:
        print(f"Error decoding JSON from Gemini API: {response.text}")
        return Response(
            {"detail": "An unexpected error occurred while parsing the AI response."},
            status=status.HTTP_500_INTERNAL_SERVER_ERROR
        )
    except Exception as e:
        print(f"Error calling Gemini API for institution overview: {e}")
        return Response(
            {"detail": f"An unexpected error occurred: {str(e)}"},
            status=status.HTTP_500_INTERNAL_SERVER_ERROR
        )

# Eligibility View
class EligibilityCheckAPIView(APIView):
  permission_classes = [permissions.IsAuthenticated] # Only authenticated users can use this

  def post(self, request, *args, **kwargs):
    # use serializer for validation
    serializer = EligibilityCheckRequestSerializer(data=request.data)
    serializer.is_valid(raise_exception=True) # Raise exception if validation fails
    validated_data = serializer.validated_data

    # Extract data from the frontend request
    institution_name = validated_data['institution_name']
    desired_course = validated_data['desired_course']
    o_level_sittings = validated_data['o_level_sittings']
    o_level_sitting_1 = validated_data['o_level_sitting_1']
    o_level_sitting_2 = validated_data['o_level_sitting_2']
    jamb_score = validated_data['jamb_score']
    jamb_subjects = validated_data['jamb_subjects']
    
    o_level_results_combined = f"1st Sitting: {o_level_sitting_1}"
    if o_level_sittings == '2':
      o_level_results_combined += f"\n2nd Sitting: {o_level_sitting_2}"

    # Prompt for Gemini model
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
    - "suggested_courses_to_study": array of strings (if not eligible for desired course, suggest *related or alternative* courses they might be eligible for based on their *provided O'Level and JAMB subjects*, staying within the general academic stream (e.g., Arts, Sciences, Social Sciences, Management). Avoid suggesting courses from entirely different streams if the provided subjects do not support them.)
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
            }
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

# Chatbot View
class ChatbotAPIView(APIView):
  permission_classes = [permissions.IsAuthenticated]

  def post(self, request, *args, **kwargs):
    # Use the serializer for validation
    serializer = ChatbotRequestSerializer(data=request.data)
    serializer.is_valid(raise_exception=True)
    latest_user_message = serializer.validated_data['chat_history'][-1]['parts'][0]['text']
  
    # Save the user's message to the database
    user_message_obj = ChatHistory.objects.create(
      user=request.user,
      role='user',
      message=latest_user_message
    )
  
    #Fetch the full chat history from the database to send to Gemini
    chat_objects = ChatHistory.objects.filter(user=request.user).order_by('timestamp')
    
    # Convert frontend chat history format to Gemini's expected format
    gemini_chat_history = []
    for chat_obj in chat_objects:
      gemini_chat_history.append({
        "role": 'model' if chat_obj.role == 'bot' else chat_obj.role,
        "parts": [{"text": chat_obj.message}]
      })

    if not gemini_chat_history:
      return Response({"detail": "No valid chat history provided after serialization."}, status=status.HTTP_400_BAD_REQUEST)
    
    # Define the system instruction for the Gemini model
    system_instruction_text = (
      "You are an AI assistant specialized in Nigerian university admissions. "
      "Your sole purpose is to provide information and guidance related to the admission processes of universities and other tertiary institutions in Nigeria. "
      "Do not engage in conversations outside of this topic. If a user asks about something else, politely state that you can only assist with Nigerian admission-related questions."
      "\n\n**IMPORTANT: Format your response using Markdown for easy readability.**"
    )
    initial_instruction = {"role": "user", "parts": [{"text": system_instruction_text}]}
    initial_response = {"role": "model", "parts": [{"text": "Hello, how can I help you with Nigerian admissions?"}]}
    full_contents = [initial_instruction, initial_response] + gemini_chat_history

   # map of technical errors to user-friendly messages
    error_map = {
      "unexpected keyword argument 'system_instruction'": "We're having trouble with our AI assistant. Please try your message again.",
      "400 Please use a valid role: user, model.": "There was an issue with the conversation format. Let's start fresh!",
      "connection refused": "It looks like the server is busy. Please give it a minute and try again.",
      "invalid request": "Sorry, I can't process that request. Could you rephrase your question?",
    }

    try:
      response = model.generate_content(contents=full_contents)
      
      bot_reply = response.text

      # Save model's reply to the database
      ChatHistory.objects.create(
        user=request.user,
        role='model',
        message=bot_reply
      )
      
      return Response({"bot_reply": bot_reply}, status=status.HTTP_200_OK)

    except Exception as e:
      # Delete the user message from the database on failure
      user_message_obj.delete()

      error_message = str(e)
      user_friendly_message = "An unexpected error occurred. Please try again later."
      
      for key, value in error_map.items():
        if key in error_message.lower():
          user_friendly_message = value
          break

      print(f"Error calling Gemini API for chatbot: {error_message}")
      return Response({"detail": user_friendly_message}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
    
class ChatHistoryAPIView(APIView):
  permission_classes = [permissions.IsAuthenticated]
  
  def get(self, request, *args, **kwargs):
    history = ChatHistory.objects.filter(user=request.user).order_by('timestamp')
    
    formatted_history = [
      {"role": obj.role, "parts": [{"text": obj.message}]}
      for obj in history
    ]
    
    return Response(formatted_history, status=status.HTTP_200_OK)