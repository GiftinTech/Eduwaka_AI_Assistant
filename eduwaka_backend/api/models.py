from django.db import models
from django.contrib.auth.models import AbstractBaseUser, BaseUserManager, PermissionsMixin
from django.utils import timezone

# Custom User Profile (Extending Django's default User)
class UserProfileManager(BaseUserManager):
  def create_user(self, username, email, password=None, **extra_fields):
    if not username:
      raise ValueError('The Username field must be set')
    if not email:
      raise ValueError('The Email field must be set')
    email = self.normalize_email(email)
    user = self.model(username=username, email=email, **extra_fields)
    user.set_password(password)
    user.save(using=self._db)
    return user

  def create_superuser(self, username, email, password=None, **extra_fields):
    # Ensure extra_fields includes required defaults for superuser
    extra_fields.setdefault('is_staff', True)
    extra_fields.setdefault('is_superuser', True)
    extra_fields.setdefault('is_active', True) # Superusers are usually active

    if extra_fields.get('is_staff') is not True:
      raise ValueError('Superuser must have is_staff=True.')
    if extra_fields.get('is_superuser') is not True:
      raise ValueError('Superuser must have is_superuser=True.')

    return self.create_user(username, email, password, **extra_fields)

class UserProfile(AbstractBaseUser, PermissionsMixin):
  username = models.CharField(max_length=150, unique=True)
  email = models.EmailField(unique=True)
  first_name = models.CharField(max_length=30, blank=True)
  last_name = models.CharField(max_length=30, blank=True)
  date_joined = models.DateTimeField(default=timezone.now)
  is_active = models.BooleanField(default=True)
  is_staff = models.BooleanField(default=False)

  objects = UserProfileManager()

  USERNAME_FIELD = 'username' 
  REQUIRED_FIELDS = ['email', 'first_name', 'last_name'] # These fields will be prompted when creating a user

  # New fields for soft deletion
  is_deleted = models.BooleanField(default=False)
  deleted_at = models.DateTimeField(null=True, blank=True)

  def __str__(self):
    return self.username

  def get_full_name(self):
    return f"{self.first_name} {self.last_name}".strip()

  def get_short_name(self):
    return self.first_name
    
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