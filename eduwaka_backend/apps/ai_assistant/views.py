from rest_framework import permissions, status
import google.generativeai as genai
from django.conf import settings
import json

from rest_framework.response import Response
from rest_framework.views import APIView
from apps.ai_assistant.serializers import EligibilityCheckRequestSerializer, ChatbotRequestSerializer 

# Configure Gemini API with the key from settings
genai.configure(api_key=settings.GEMINI_API_KEY)
model = genai.GenerativeModel("gemini-2.5-flash") 

# Create your views here.
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

class ChatbotAPIView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def post(self, request, *args, **kwargs):
      # Use the serializer for validation
      serializer = ChatbotRequestSerializer(data=request.data)
      serializer.is_valid(raise_exception=True) # Raise exception if validation fails
      chat_history = serializer.validated_data['chat_history']
      
      # Convert frontend chat history format to Gemini's expected format
      # The serializer ensures the structure is already correct for 'role' and 'parts'
      gemini_chat_history = []
      for msg in chat_history:
        # Reconstruct to exact Gemini format, though it should largely match now
        gemini_chat_history.append({"role": msg['role'], "parts": msg['parts']})

      if not gemini_chat_history:
        return Response({"detail": "No valid chat history provided after serialization."}, status=status.HTTP_400_BAD_REQUEST)        # Ensure 'text' key exists before accessing
    
      try:
        # Get the latest user message
        latest_user_message = gemini_chat_history[-1]['parts'][0]['text']

        concise_prompt = f"{latest_user_message}. Keep your response very concise and to the point, suitable for a quick read."
        # Or: concise_prompt = f"{latest_user_message}. Respond briefly, like you're texting."
        # Or: concise_prompt = f"{latest_user_message}. Give a short, direct answer."

        chat = model.start_chat(history=gemini_chat_history[:-1])
        response = chat.send_message(concise_prompt) # Send the modified prompt

        bot_reply = response.text
        return Response({"bot_reply": bot_reply}, status=status.HTTP_200_OK)

      except Exception as e:
        print(f"Error calling Gemini API for chatbot: {e}")
        return Response({"detail": f"Error processing chatbot request: {str(e)}"}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
