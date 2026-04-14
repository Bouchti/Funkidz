from rest_framework import permissions


class IsAdmin(permissions.BasePermission):
    """Utilisateur authentifié avec rôle ADMIN."""

    def has_permission(self, request, view):
        return bool(
            request.user
            and request.user.is_authenticated
            and getattr(request.user, 'role', None) == 'ADMIN'
        )


class IsAnimateur(permissions.BasePermission):
    """
    Allows access only to users with the ANIMATEUR role.
    """
    def has_permission(self, request, view):
        return bool(request.user and request.user.is_authenticated and request.user.role == 'ANIMATEUR')

class IsOwnerOrAdmin(permissions.BasePermission):
    """
    Object-level permission to only allow owners of an object (Booking) or admins to access it.
    Assumes the model instance has a `user` attribute.
    """
    def has_object_permission(self, request, view, obj):
        # Admin can do anything
        if request.user.is_authenticated and request.user.role == 'ADMIN':
            return True
        
        # Check ownership
        if hasattr(obj, 'user'):
            return obj.user == request.user
        
        return False
