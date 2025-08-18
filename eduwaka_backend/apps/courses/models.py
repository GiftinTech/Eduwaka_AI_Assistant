from django.db import models
from apps.institutions.models import Institution

# Course Model
class Course(models.Model):
  institution = models.ForeignKey(Institution, on_delete=models.CASCADE, related_name='courses')
  name = models.CharField(max_length=255)
  faculty = models.CharField(max_length=255, blank=True, null=True)
  department = models.CharField(max_length=255, blank=True, null=True)
  duration_years = models.IntegerField(help_text="Duration in years")

  # Admission Requirements 
  olevel_requirements = models.TextField(help_text="e.g., 5 credits in English, Maths, Physics, Chemistry, Biology", blank=True, null=True)
  jamb_requirements = models.TextField(help_text="e.g., English, Physics, Chemistry, Biology", blank=True, null=True)
  post_utme_details = models.TextField(blank=True, null=True)

  class Meta:
    unique_together = ('institution', 'name')
    ordering = ['name']

  def __str__(self):
    return f"{self.name} at {self.institution.name}"
