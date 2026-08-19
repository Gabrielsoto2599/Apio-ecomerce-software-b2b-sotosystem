import dj_database_url
import os
from pathlib import Path

# Build paths inside the project like this: BASE_DIR / 'subdir'.
BASE_DIR = Path(__file__).resolve().parent.parent

# SECURITY WARNING: keep the secret key used in production secret!
SECRET_KEY = 'django-insecure-071_)8s3o88@im#9rvk^q=9h4#_!ck2td-7*ze*$7t3e1bn#6o'

# SECURITY WARNING: don't run with debug turned on in production!
DEBUG = True

ALLOWED_HOSTS = ['*']

# Application definition
INSTALLED_APPS = [
    'django.contrib.admin',
    'django.contrib.auth',
    'django.contrib.contenttypes',
    'django.contrib.sessions',
    'django.contrib.messages',
    'django.contrib.staticfiles',
    'bodega', 
    'corsheaders', 
]

MIDDLEWARE = [
    'corsheaders.middleware.CorsMiddleware', # 🛡️ Filtra y aprueba las cabeceras de red antes de procesar la lógica
    'django.middleware.security.SecurityMiddleware',
    'whitenoise.middleware.WhiteNoiseMiddleware', # Optimiza los archivos estáticos en Render
    'django.contrib.sessions.middleware.SessionMiddleware',
    'django.middleware.common.CommonMiddleware',
    'django.middleware.csrf.CsrfViewMiddleware',
    'django.contrib.auth.middleware.AuthenticationMiddleware',
    'django.contrib.messages.middleware.MessageMiddleware',
    'django.middleware.clickjacking.XFrameOptionsMiddleware',
]

# 🎯 REPARACIÓN CRÍTICA DE RUTA: Apunta a tu carpeta real de configuración del ERP Apio
ROOT_URLCONF = 'core.urls'

# ====================================================================
# 🔓 DEMOLICIÓN DE RESTRICCIONES DE RED - SOTO SYSTEM POS (PRODUCCIÓN CLOUD)
# ====================================================================
CORS_ALLOW_ALL_ORIGINS = True
CORS_ALLOW_CREDENTIALS = True
CORS_PREFLIGHT_MAX_AGE = 86400  # Cachea el preflight por 24 horas para que Electron no pregunte a cada rato

CORS_ALLOW_METHODS = [
    'DELETE',
    'GET',
    'OPTIONS',
    'PATCH',
    'POST',
    'PUT',
]

CORS_ALLOW_HEADERS = [
    'accept',
    'accept-encoding',
    'authorization',
    'content-type',
    'dnt',
    'origin',
    'user-agent',
    'x-csrftoken',
    'x-requested-with',
]

# Evita que las redirecciones por falta de "/" rompan el CORS en producción
APPEND_SLASH = True

# Opcional: Blindaje extendido para solicitudes del navegador
CSRF_TRUSTED_ORIGINS = [
    "http://localhost:5173",
    "http://127.0.0.1:5173",
    "http://localhost:5174",
    "http://127.0.0.1:5174",
    "https://*.up.railway.app"
]

TEMPLATES = [
    {
        'BACKEND': 'django.template.backends.django.DjangoTemplates',
        'DIRS': [],
        'APP_DIRS': True,
        'OPTIONS': {
            'context_processors': [
                'django.template.context_processors.request',
                'django.contrib.auth.context_processors.auth',
                'django.contrib.messages.context_processors.messages',
            ],
        },
    },
]

# 🎯 REPARACIÓN CRÍTICA DE ARRANQUE: Apunta a tu carpeta real de producción para evitar el Error 500
WSGI_APPLICATION = 'core.wsgi.application'


# Password validation
# https://djangoproject.com

AUTH_PASSWORD_VALIDATORS = [
    {
        'NAME': 'django.contrib.auth.password_validation.UserAttributeSimilarityValidator',
    },
    {
        'NAME': 'django.contrib.auth.password_validation.MinimumLengthValidator',
    },
    {
        'NAME': 'django.contrib.auth.password_validation.CommonPasswordValidator',
    },
    {
        'NAME': 'django.contrib.auth.password_validation.NumericPasswordValidator',
    },
]


# Internationalization - Sincronizado perfectamente con Venezuela (Soto System POS)
LANGUAGE_CODE = 'es-ve'

TIME_ZONE = 'America/Caracas'

USE_I18N = True

USE_TZ = True


# Static files (CSS, JavaScript, Images)
# https://djangoproject.com

STATIC_URL = 'static/'
# Configuración WhiteNoise para servir los archivos estáticos de forma indestructible en Render sin caer en bucles
STATIC_ROOT = os.path.join(BASE_DIR, 'staticfiles')


# =====================================================================
# 🔐 BLINDAJE DE SEGURIDAD ABSOLUTO PARA DEMO SOTO SYSTEM (RAILWAY)
# =====================================================================
CORS_ALLOW_ALL_ORIGINS = True  # 🔓 Abre las compuertas para cualquier origen externo
CORS_ALLOW_CREDENTIALS = True

# Lista de orígenes de confianza permitidos para peticiones seguras de formularios
CSRF_TRUSTED_ORIGINS = [
    "http://localhost:5173", # 🎯 REPARACIÓN MAESTRA: Dale acceso a tu pestaña web actual de Chrome
    "http://127.0.0.1:5173",
    "http://localhost:5174",
    "http://127.0.0.1:5174",
    "https://*.up.railway.app"
]


# =========================================================================
# 🎯 ARQUITECTURA DE DATOS CLOUD SEGU_RA (SOTO SYSTEM 2026)
# =========================================================================
import dj_database_url

# Extrae automáticamente las credenciales de la variable DATABASE_URL interna que inyectamos
if os.environ.get('DATABASE_URL'):
    print("☁️ [SOTO CORE]: Conexión Cloud Activa. Extrayendo tubería de datos desde Railway...")
    DATABASES = {
        'default': dj_database_url.config(
            conn_max_age=600,
            ssl_require=False  # Permite conectar por la red privada interna sin requerir certificados SSL estrictos
        )
    }
else:
    print("🔒 [SOTO CORE]: Ejecución Offline. Activando SQLite3 interno...")
    DATABASES = {
        'default': {
            'ENGINE': 'django.db.backends.sqlite3',
            'NAME': BASE_DIR / 'db.sqlite3',
        }
    }

# Configuración por defecto para llaves primarias de modelos
DEFAULT_AUTO_FIELD = 'django.db.models.BigAutoField'
