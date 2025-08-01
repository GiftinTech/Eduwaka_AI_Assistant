from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import InstitutionViewSet, CourseViewSet, UserProfileViewSet, EligibilityCheckAPIView, ChatbotAPIView, UserListViewSet, AdminDeleteUserViewSet
from .serializers import RegisterSerializer # Import the serializer for registration
from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView # Import JWT views
from rest_framework.generics import CreateAPIView # For registration view
from rest_framework.permissions import AllowAny # For registration view

router = DefaultRouter()
router.register(r'institutions', InstitutionViewSet)
router.register(r'courses', CourseViewSet)
router.register(r'profile', UserProfileViewSet) # User profile endpoint

urlpatterns = [
  path('', include(router.urls)),
  # DRF Simple JWT Authentication URLs
  path('auth/login/', TokenObtainPairView.as_view(), name='token_obtain_pair'),
  path('auth/login/refresh/', TokenRefreshView.as_view(), name='token_refresh'),

  # User Registration
  path('register/', CreateAPIView.as_view(serializer_class=RegisterSerializer, permission_classes=(AllowAny,)), name='register'),

  # Get all users (Admin)
  path('users/', UserListViewSet.as_view(), name='user-list'),

  # Delete user (Admin)
  path('users/<int:user_id>/delete/', AdminDeleteUserViewSet.as_view(), name='admin-delete-user'),
  
  # AI Endpoints
  path('eligibility-check/', EligibilityCheckAPIView.as_view(), name='eligibility-check'),
  path('chatbot/', ChatbotAPIView.as_view(), name='chatbot'),
]
