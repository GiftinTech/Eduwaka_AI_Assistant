from django.urls import path, include
from rest_framework.routers import DefaultRouter
from apps.users.views import UserProfileViewSet, UserListViewSet, DeleteUserViewSet, UserUpdateViewSet, ChangePasswordViewSet, ForgotPasswordViewSet, ResetPasswordViewSet, LoginViewSet
from apps.users.serializers import RegisterSerializer # Import the serializer for registration
from rest_framework_simplejwt.views import TokenRefreshView # Import JWT views
from rest_framework.generics import CreateAPIView # For registration view
from rest_framework.permissions import AllowAny # For registration view
from . import views

router = DefaultRouter()

router.register(r'profile', UserProfileViewSet) # User profile endpoint

urlpatterns = [
  path('', include(router.urls)),
  
  # DRF Simple JWT Authentication URLs
  path('auth/login/', LoginViewSet.as_view(), name='token_obtain_pair'),
  path('auth/token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),

  # User Registration
  path('register/', CreateAPIView.as_view(serializer_class=RegisterSerializer, permission_classes=(AllowAny,)), name='register'),

  # Get all api/users is Admin access only
  path('users/', UserListViewSet.as_view(), name='user-list'),

  # Update current user
  path('users/<int:user_id>/', UserUpdateViewSet.as_view(), name='update-user'),

  # Change current user pwd
  path('auth/change-password/', ChangePasswordViewSet.as_view(), name='change-password'),

  # Delete user (Admin)
  path('users/<int:user_id>/', DeleteUserViewSet.as_view(), name='admin-delete-user'),

  # Forgot pwd and reset pwd
  path('auth/forgot-password/', ForgotPasswordViewSet.as_view(), name='forgot-password'),
  path('auth/reset-password/', ResetPasswordViewSet.as_view(), name='reset-password'),

  # test network
  path('network-test/', views.network_debug, name='network_debug'),
]
