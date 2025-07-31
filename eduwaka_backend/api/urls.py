from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import InstitutionViewSet, CourseViewSet, UserProfileViewSet, EligibilityCheckAPIView
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
  path('auth/token/', TokenObtainPairView.as_view(), name='token_obtain_pair'),
  path('auth/token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
]
