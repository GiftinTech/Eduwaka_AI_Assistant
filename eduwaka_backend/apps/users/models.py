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

  photo = models.ImageField(
    upload_to='profile_photos/',
    blank=True,
    null=True,
    default='images/default.png' 
  )

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