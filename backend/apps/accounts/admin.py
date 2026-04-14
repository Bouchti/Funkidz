from django.contrib import admin
from django.contrib.auth.admin import UserAdmin as BaseUserAdmin
from .models import User, AnimateurProfile

class AnimateurProfileInline(admin.StackedInline):
    model = AnimateurProfile
    can_delete = False
    verbose_name_plural = 'Animateur Profile'

@admin.register(User)
class UserAdmin(BaseUserAdmin):
    inlines = (AnimateurProfileInline,)
    list_display = ('email', 'role', 'is_verified', 'is_staff')
    list_filter = ('role', 'is_verified', 'is_staff', 'is_active')
    
    fieldsets = (
        (None, {'fields': ('email', 'password')}),
        ('Personal Info', {'fields': ('role', 'is_verified')}),
        ('Permissions', {'fields': ('is_active', 'is_staff', 'is_superuser', 'groups', 'user_permissions')}),
        ('Important dates', {'fields': ('last_login', 'created_at', 'updated_at')}),
    )
    readonly_fields = ('created_at', 'updated_at')
    ordering = ('email',)
    actions = ['verify_users', 'unverify_users']

    def verify_users(self, request, queryset):
        queryset.update(is_verified=True)
    verify_users.short_description = "Verify selected users"

    def unverify_users(self, request, queryset):
        queryset.update(is_verified=False)
    unverify_users.short_description = "Unverify selected users"
