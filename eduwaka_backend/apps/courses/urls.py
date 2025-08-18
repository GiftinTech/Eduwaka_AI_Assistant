from django.urls import path, include
from rest_framework.routers import DefaultRouter
from apps.courses.views import CourseViewSet # import from models/views correctly
from apps.institutions.views import InstitutionViewSet  # import from models/views correctly

router = DefaultRouter()
router.register(r"courses", CourseViewSet)
router.register(r"institutions", InstitutionViewSet)

urlpatterns = [
  path("", include(router.urls)), 
]
