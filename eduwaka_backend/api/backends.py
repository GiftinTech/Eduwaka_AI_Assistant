from django.contrib.auth.backends import ModelBackend
from django.contrib.auth import get_user_model
from datetime import timedelta
from django.utils import timezone

User = get_user_model()

class SoftDeleteAuthenticationBackend(ModelBackend):
  def authenticate(self, request, username=None, password=None, **kwargs):
    """
      Authenticates a user, checking for soft-delete status.
    """
    
    try:
      user = User.objects.get(username=username)
    except User.DoesNotExist:
      return None

    # Check if the user's account is soft-deleted
    if user.is_deleted:
      deletion_time = user.deleted_at
      thirty_days_ago = timezone.now() - timedelta(days=30)
      
      # If the user logs in within 30 days, reactivate their account
      if deletion_time >= thirty_days_ago:
        user.is_deleted = False
        user.deleted_at = None
        user.save()
        
        # Check password as normal after reactivation
        if user.check_password(password):
          return user
      else:
        # Account is soft-deleted for too long, prevent login
        return None
  
    # If the account is not deleted, proceed with normal authentication
    if user.check_password(password):
      return user
    
    return None