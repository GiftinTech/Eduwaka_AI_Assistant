from django.urls import path, include
from rest_framework.routers import DefaultRouter

from apps.ai_assistant.views import EligibilityCheckAPIView, ChatbotAPIView, ChatHistoryAPIView, InstitutionOverviewAPIView

router = DefaultRouter()

#router.register(r'profile', UserProfileViewSet) # User profile endpoint

urlpatterns = [
  path('', include(router.urls)),

  # AI Endpoints
  path('eligibility-check/', EligibilityCheckAPIView.as_view(), name='eligibility-check'),
  path('chatbot/', ChatbotAPIView.as_view(), name='chatbot'),
  path('chat_history/', ChatHistoryAPIView.as_view(), name='chat-history-api'),
  path('institution-overview/', InstitutionOverviewAPIView.as_view(), name='institution-overview'),
]

