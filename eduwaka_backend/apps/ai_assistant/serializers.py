from rest_framework import serializers


class InstitutionRequestSerializer(serializers.Serializer):
  institution_name = serializers.CharField(max_length=255)

class EligibilityCheckRequestSerializer(serializers.Serializer):
  """
  Serializer for validating incoming data for the EligibilityCheckAPIView.
  """
  institution_name = serializers.CharField(max_length=255, required=True)
  desired_course = serializers.CharField(max_length=255, required=True)
  o_level_sittings = serializers.ChoiceField(choices=['1', '2'], required=True)
  o_level_sitting_1 = serializers.CharField(required=True)
  o_level_sitting_2 = serializers.CharField(required=False, allow_blank=True) # Optional for 1 sitting
  jamb_score = serializers.IntegerField(required=True, min_value=0, max_value=400)
  jamb_subjects = serializers.CharField(required=True)

class ChatMessagePartSerializer(serializers.Serializer):
  """
  Serializer for the 'parts' within a chat message.
  Assumes each part has a 'text' field.
  """
  text = serializers.CharField(required=True, allow_blank=False)

class ChatHistoryItemSerializer(serializers.Serializer):
  """
  Serializer for each item in the chat_history list.
  """
  role = serializers.CharField(required=True) # Could be serializers.ChoiceField(['user', 'bot']) for strict roles
  parts = ChatMessagePartSerializer(many=True, required=True)

class ChatbotRequestSerializer(serializers.Serializer):
  """
  Serializer for validating incoming data for the ChatbotAPIView.
  """
  chat_history = ChatHistoryItemSerializer(many=True, required=True, min_length=1)