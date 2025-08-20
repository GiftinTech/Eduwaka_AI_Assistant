from django.db import models
    
# Institution Model
class Institution(models.Model):
  # Field for the academic type
  INSTITUTION_TYPES = (
    ('university', 'University'),
    ('polytechnic', 'Polytechnic'),
    ('college_of_education', 'College of Education')
  )

  # Field for the ownership type
  OWNERSHIP_TYPES = (
    ('federal', 'Federal'),
    ('state', 'State'),
    ('private', 'Private')
  )

  name = models.CharField(max_length=255, unique=True)
  state = models.CharField(max_length=100, null=True, blank=True)
  city = models.CharField(max_length=100, null=True, blank=True)
  abbreviation = models.CharField(max_length=100, null=True, default="Check on Google")
  website = models.CharField(max_length=100, unique=True, null=True,default="Check on Google")
  institution_type = models.CharField(max_length=50, choices=INSTITUTION_TYPES, default='university')
  ownership_type = models.CharField(
    max_length=50,
    choices=OWNERSHIP_TYPES,
    default='federal'
  )
  year_of_establishment = models.TextField(blank=True, null=True)
  description = models.TextField(blank=True, null=True, default="Check on Google")

  class Meta:
    ordering = ['name']
    verbose_name_plural = 'Institutions'

  def __str__(self):
    return self.name

