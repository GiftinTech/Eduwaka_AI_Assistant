from rest_framework import permissions

class IsAdminOrReadOnly(permissions.BasePermission):
  """
    Custom permission to only allow admins to perform CUD operations.
    Read operations are allowed for all.
  """
  def has_permission(self, request, view):
    # Allow GET, HEAD, or OPTIONS requests for any user.
    if request.method in permissions.SAFE_METHODS:
      return True

    # Write permissions are only allowed to superusers.
    return request.user and request.user.is_superuser