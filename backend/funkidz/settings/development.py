from .base import *

DEBUG = True

ALLOWED_HOSTS = ['*']

# You can override other settings for development here
DATABASES = {
    'default': {
        'ENGINE': 'django.db.backends.sqlite3',
        'NAME': BASE_DIR / 'db.sqlite3',
    }
}

# Use console backend for emails in development
EMAIL_BACKEND = 'django.core.mail.backends.console.EmailBackend'
