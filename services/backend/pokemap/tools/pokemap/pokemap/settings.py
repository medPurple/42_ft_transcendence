"""
Django settings for pokemap project.
"""

from pathlib import Path
from pokemap.vault import VaultClient
import os

BASE_DIR = Path(__file__).resolve().parent.parent

# ── Vault ─────────────────────────────────────────────────────────────────────
vault = VaultClient()
pokemap_secrets = vault.secret('pokemap')

# ── Sécurité ──────────────────────────────────────────────────────────────────
SECRET_KEY = pokemap_secrets['django_secret_key']
DEBUG = os.getenv('DJANGO_DEBUG', 'False') == 'True'

_domain          = os.getenv('DOMAIN', '')
_frontend_origin = os.getenv('FRONTEND_ORIGIN', '')

ALLOWED_HOSTS = [
    '127.0.0.1',
    'localhost',
    'pokemap',
    'pokemapservice',
] + ([_domain] if _domain else [])

# ── CSRF / CORS ───────────────────────────────────────────────────────────────
CSRF_COOKIE_SECURE = True
SESSION_COOKIE_SECURE = True
CSRF_COOKIE_SAMESITE = 'None'
SESSION_COOKIE_SAMESITE = 'None'
CSRF_ALLOW_ALL_ORIGINS = False
CORS_ALLOW_ALL_ORIGINS = False
CORS_ALLOW_CREDENTIALS = True
CORS_ALLOWED_ORIGINS = [
    'https://localhost:4430',
    'https://127.0.0.1:4430',
] + ([f'https://{_domain}'] if _domain else []) \
  + ([_frontend_origin] if _frontend_origin else [])

# ── Logging ───────────────────────────────────────────────────────────────────
LOGGING = {
    'version': 1,
    'disable_existing_loggers': False,
    'handlers': {'console': {'class': 'logging.StreamHandler'}},
    'root': {
        'handlers': ['console'],
        'level': 'DEBUG' if DEBUG else 'WARNING',
    },
}

# ── Applications ──────────────────────────────────────────────────────────────
INSTALLED_APPS = [
    'daphne',
    'overworld',
    'rest_framework',
    'django.contrib.admin',
    'django.contrib.auth',
    'django.contrib.contenttypes',
    'django.contrib.sessions',
    'django.contrib.messages',
    'django.contrib.staticfiles',
    'corsheaders',
]

MIDDLEWARE = [
    'django.middleware.security.SecurityMiddleware',
    'django.contrib.sessions.middleware.SessionMiddleware',
    'corsheaders.middleware.CorsMiddleware',
    'django.middleware.common.CommonMiddleware',
    'django.middleware.csrf.CsrfViewMiddleware',
    'django.contrib.auth.middleware.AuthenticationMiddleware',
    'django.contrib.messages.middleware.MessageMiddleware',
    'django.middleware.clickjacking.XFrameOptionsMiddleware',
]

ROOT_URLCONF = 'pokemap.urls'

TEMPLATES = [
    {
        'BACKEND': 'django.template.backends.django.DjangoTemplates',
        'DIRS': [],
        'APP_DIRS': True,
        'OPTIONS': {
            'context_processors': [
                'django.template.context_processors.debug',
                'django.template.context_processors.request',
                'django.contrib.auth.context_processors.auth',
                'django.contrib.messages.context_processors.messages',
            ],
        },
    },
]

WSGI_APPLICATION = 'pokemap.wsgi.application'
ASGI_APPLICATION = 'pokemap.asgi.application'

CHANNEL_LAYERS = {
    "default": {
        "BACKEND": "channels_redis.core.RedisChannelLayer",
        "CONFIG": {
            "hosts": [("127.0.0.1", 6379)],
        },
    },
}

# ── Base de données ───────────────────────────────────────────────────────────
DATABASES = {
    'default': {
        'ENGINE': 'django.db.backends.postgresql',
        'NAME': pokemap_secrets['db_name'],
        'USER': pokemap_secrets['db_username'],
        'PASSWORD': pokemap_secrets['db_password'],
        'HOST': os.getenv('DB_HOST', '127.0.0.1'),
        'PORT': os.getenv('DB_PORT', '5432'),
    }
}

LANGUAGE_CODE = 'en-us'
TIME_ZONE = 'UTC'
USE_I18N = True
USE_TZ = True
STATIC_URL = 'static/'
DEFAULT_AUTO_FIELD = 'django.db.models.BigAutoField'
