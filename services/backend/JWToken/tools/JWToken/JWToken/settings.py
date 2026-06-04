"""
Django settings for JWToken project.
"""

from pathlib import Path
from JWToken.vault import VaultClient
import os

BASE_DIR = Path(__file__).resolve().parent.parent

# ── Vault ─────────────────────────────────────────────────────────────────────
# Les secrets sont lus une seule fois au démarrage du process (settings chargés une fois).
# views.py lit JWT_SIGNING_KEY depuis settings — aucun appel Vault à chaque requête.
vault = VaultClient()
jwt_secrets = vault.secret('key')

# ── Sécurité ──────────────────────────────────────────────────────────────────
SECRET_KEY = jwt_secrets['django_secret_key']

# Clé de signature JWT — mise en cache ici pour ne pas appeler Vault à chaque requête
JWT_SIGNING_KEY = jwt_secrets['SECRET_KEY']
DEBUG = os.getenv('DJANGO_DEBUG', 'False') == 'True'

_domain          = os.getenv('DOMAIN', '')
_frontend_origin = os.getenv('FRONTEND_ORIGIN', '')

ALLOWED_HOSTS = [
    '127.0.0.1',
    'localhost',
    'jwtoken',
    'tokenservice',
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
    'django.contrib.staticfiles',
    'tokenAPI',
    'corsheaders',
]

MIDDLEWARE = [
    'django.middleware.security.SecurityMiddleware',
    'corsheaders.middleware.CorsMiddleware',
    'django.middleware.common.CommonMiddleware',
    'django.middleware.csrf.CsrfViewMiddleware',
    'django.middleware.clickjacking.XFrameOptionsMiddleware',
]

ROOT_URLCONF = 'JWToken.urls'

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

WSGI_APPLICATION = 'JWToken.wsgi.application'

# JWToken est stateless — pas de base de données nécessaire
DATABASES = {}

LANGUAGE_CODE = 'en-us'
TIME_ZONE = 'UTC'
USE_I18N = True
USE_TZ = True
STATIC_URL = 'static/'
DEFAULT_AUTO_FIELD = 'django.db.models.BigAutoField'
