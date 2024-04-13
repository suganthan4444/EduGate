INSTALLED_APPS = [
    # Default Django apps...
    'django.contrib.auth',
    'django.contrib.contenttypes',
    'django.contrib.sessions',
    'django.contrib.messages',
    'django.contrib.staticfiles',
    # Third-party apps...
    'rest_framework',
]
# For Django REST Framework, you might want to add settings like these:
REST_FRAMEWORK = {
    # Global settings for REST framework
    'DEFAULT_PERMISSION_CLASSES': [
        'rest_framework.permissions.AllowAny',
    ],
    'DEFAULT_RENDERER_CLASSES': [
        'rest_framework.renderers.JSONRenderer',
    ],
}
MIDDLEWARE = [
    'corsheaders.middleware.CorsMiddleware',
    ...
]
CORS_ALLOWED_ORIGINS = [
    "http://localhost:3000",  # Allow requests from your React app
]
