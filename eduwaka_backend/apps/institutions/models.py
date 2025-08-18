from django.db import models
    
# Institution Model
class Institution(models.Model):
  INSTITUTION_TYPES = (
    ('university', 'University'),
    ('polytechnic', 'Polytechnic'),
    ('college_of_education', 'College of Education'),
    ('other', 'Other'),
  )
  name = models.CharField(max_length=255, unique=True)
  type = models.CharField(max_length=50, choices=INSTITUTION_TYPES, default='university')
  location = models.CharField(max_length=255)
  description = models.TextField(blank=True, null=True)
  website = models.TextField(blank=True, null=True)

  class Meta:
    ordering = ['name']
    verbose_name_plural = 'Institutions'

  def __str__(self):
    return self.name

