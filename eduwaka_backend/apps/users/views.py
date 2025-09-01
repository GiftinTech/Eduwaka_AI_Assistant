from rest_framework import viewsets, permissions, status, generics
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer
from rest_framework.permissions import AllowAny
from rest_framework.response import Response
from rest_framework.decorators import action
from rest_framework.views import APIView
from apps.users.models import UserProfile
from apps.users.serializers import UserProfileSerializer, ChangePasswordSerializer, ForgotPasswordSerializer, ResetPasswordSerializer, LoginSerializer
from django.contrib.auth import get_user_model
from django.conf import settings
from django.core.mail import send_mail
from django.utils.http import urlsafe_base64_encode
from django.utils.encoding import force_bytes
from django.contrib.auth.tokens import default_token_generator
from django.utils import timezone
from datetime import timedelta
from django.db import OperationalError
from rest_framework.parsers import MultiPartParser, FormParser

User = get_user_model()

# LoginViewSet
class LoginViewSet(APIView):
  permission_classes = [AllowAny]
  serializer_class = LoginSerializer

  def post(self, request, *args, **kwargs):
    serializer = self.serializer_class(data=request.data)
    serializer.is_valid(raise_exception=True)

    username = serializer.validated_data['username']
    password = serializer.validated_data['password']


    try:
      try:
        user = User.objects.get(username=username)
      except User.DoesNotExist:
        return Response(
          {"detail": "Invalid username or password."},
          status=status.HTTP_401_UNAUTHORIZED
        )
    except OperationalError:
      # Graceful DB error handling
      return Response(
        {"detail": "Database connection failed. Please try again later."},
        status=status.HTTP_503_SERVICE_UNAVAILABLE
      )
    
    # Soft-delete logic
    if user.is_deleted:
      deletion_time = user.deleted_at
      thirty_days_ago = timezone.now() - timedelta(days=30)
      
      if deletion_time >= thirty_days_ago:
        if user.check_password(password):
          # Reactivate the account before generating tokens
          user.is_deleted = False
          user.deleted_at = None
          user.save()
          
          # Get tokens using the Simple JWT serializer
          jwt_serializer = TokenObtainPairSerializer(data=request.data)
          jwt_serializer.is_valid(raise_exception=True)
          
          response_data = jwt_serializer.validated_data
          response_data["detail"] = "Account recovered and logged in successfully."
          return Response(response_data, status=status.HTTP_200_OK)
      else:
        return Response(
            {"detail": "This account is permanently deleted. Please create a new one."},
            status=status.HTTP_403_FORBIDDEN
        )

    # Standard login for non-deleted accounts
    if user.check_password(password):
      jwt_serializer = TokenObtainPairSerializer(data=request.data)
      jwt_serializer.is_valid(raise_exception=True)
      return Response(jwt_serializer.validated_data, status=status.HTTP_200_OK)
    
    return Response(
      {"detail": "Invalid username or password."},
      status=status.HTTP_401_UNAUTHORIZED
    )

# Get all users - Admin
class UserListViewSet(generics.ListAPIView):
  queryset = User.objects.all()
  serializer_class = UserProfileSerializer
  permission_classes = [permissions.IsAdminUser]

# Update user - Admin
class UserUpdateViewSet(APIView):
  permission_classes = [permissions.IsAuthenticated]

  def patch(self, request, user_id):
    try:
      user = User.objects.get(id=user_id)
    except User.DoesNotExist:
      return Response(
          {"detail": "User not found"},
          status=status.HTTP_404_NOT_FOUND
      )
    
    # Prevent users from updating others' profiles unless they are admin
    if request.user != user and not request.user.is_staff:
      return Response({"detail": "You are not allowed to update this user's profile"}, status=status.HTTP_403_FORBIDDEN)

    # Prevent password update
    if 'password' in request.data:
      return Response({"detail": "You cannot update your password here"}, status=status.HTTP_400_BAD_REQUEST)
    
    serializer = UserProfileSerializer(user, data=request.data, partial=True)

    if serializer.is_valid():
      serializer.save()
      return Response({"detail": "Profile updated successfully!"}, status=status.HTTP_200_OK)
    
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

# Delete user Admin
class DeleteUserViewSet(APIView):
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

  parser_classes = (MultiPartParser, FormParser)

  def get_queryset(self):
    # Allow users to only see/edit their own profile
    if self.request.user.is_authenticated:
      return UserProfile.objects.filter(id=self.request.user.id)
    return UserProfile.objects.none()

  @action(detail=False, methods=['get', 'put', 'patch', 'delete'])
  def me(self, request):
    if request.method == 'GET':
      serializer = self.get_serializer(request.user)
      return Response(serializer.data)
    
    elif request.method in ['PUT', 'PATCH']:
      serializer = self.get_serializer(request.user, data=request.data, partial=True)
      print(request.data)
      serializer.is_valid(raise_exception=True)
      print(serializer.validated_data)
      serializer.save()
      return Response(serializer.data)
    
    elif request.method == 'DELETE':
      user_to_delete = request.user
      
      user_to_delete.is_deleted = True
      user_to_delete.deleted_at = timezone.now()
      user_to_delete.save()

      return Response(
          {"detail": "Your account has been deactivated. You can recover it within 30 days by logging in again."},
          status=status.HTTP_200_OK
      )

# Change password view - auth/change-password
class ChangePasswordViewSet(APIView):
  permission_classes = [permissions.IsAuthenticated]

  def post(self, request):
    serializer = ChangePasswordSerializer(data=request.data)
    if serializer.is_valid():
      user = request.user
      if not user.check_password(serializer.validated_data['old_password']):
        return Response({"detail": "Old password is incorrect"}, status=status.HTTP_400_BAD_REQUEST)

      user.set_password(serializer.validated_data['new_password'])
      user.save()
      return Response({"detail": "Password changed successfully!"}, status=status.HTTP_200_OK)
    
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
  
# Forgot pwd view
class ForgotPasswordViewSet(APIView):
  permission_classes = [AllowAny] 
  def post(self, request):
    serializer = ForgotPasswordSerializer(data=request.data)
    if serializer.is_valid():
      email = serializer.validated_data['email']
      user = User.objects.get(email=email)
      uidb64 = urlsafe_base64_encode(force_bytes(user.pk))
      token = default_token_generator.make_token(user)
      reset_link = f"{settings.EDUWAKA_FRONTEND_URL}reset-password/{uidb64}/{token}"

      # Send reset email
      send_mail(
        subject="Reset your Eduwaka password (Link valid for 10mins).",
        message=f"Click the link to reset your password: {reset_link}",
        from_email=settings.DEFAULT_FROM_EMAIL,
        recipient_list=[email],
      )

      # Don't send uid and token in prod, just for testing
      return Response({"detail": "Password reset link sent!", "uidb64": uidb64, "token": token}, status=status.HTTP_200_OK) 
      # return Response({"detail": "Password reset link sent!"}, status=status.HTTP_200_OK)
    
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
  
# Reser pwd view
class ResetPasswordViewSet(APIView):
  permission_classes = [AllowAny] 

  def post(self, request):
    serializer = ResetPasswordSerializer(data=request.data)
    if serializer.is_valid():
      serializer.save()
      return Response({"detail": "Password has been reset successfully."}, status=status.HTTP_200_OK)
    
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

