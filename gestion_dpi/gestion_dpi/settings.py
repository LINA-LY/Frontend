import os
from pathlib import Path
from dotenv import load_dotenv, dotenv_values
import pymysql

# Charger les variables d'environnement
load_dotenv()

# Configuration de pymysql pour MySQL
pymysql.install_as_MySQLdb()

# Répertoire de base du projet
BASE_DIR = Path(__file__).resolve().parent.parent

# Fichiers médias
MEDIA_URL = '/media/'
MEDIA_ROOT = BASE_DIR / 'media'

# Fichiers statiques


# URL de base pour servir les fichiers statiques
STATIC_URL = '/static/'

# Répertoire où Django collectera tous les fichiers statiques avec la commande collectstatic
STATIC_ROOT = BASE_DIR / 'staticfiles'

# Répertoires supplémentaires pour rechercher des fichiers statiques
STATICFILES_DIRS = [
    BASE_DIR / 'static',
]

ROOT_URLCONF = 'gestion_dpi.urls'


# Clé secrète (chargée depuis .env)
SECRET_KEY = os.getenv('SECRET_KEY')

# Mode debug
DEBUG = True

# Hôtes autorisés
ALLOWED_HOSTS = []

# Applications installées
INSTALLED_APPS = [
    'django.contrib.admin',
    'django.contrib.auth',
    'django.contrib.contenttypes',
    'django.contrib.sessions',
    'django.contrib.messages',
    'django.contrib.staticfiles',
    'utilisateurs',  # App de ton ami
    'dossier_patient',  # Ton app
    'rest_framework',  # API REST
]

# Middleware
MIDDLEWARE = [
    'django.middleware.security.SecurityMiddleware',
    'django.contrib.sessions.middleware.SessionMiddleware',
    'django.middleware.common.CommonMiddleware',
    'django.middleware.csrf.CsrfViewMiddleware',
    'django.contrib.auth.middleware.AuthenticationMiddleware',
    'django.contrib.messages.middleware.MessageMiddleware',
    'django.middleware.clickjacking.XFrameOptionsMiddleware',
]


# Configuration de la base de données (variables d'environnement)
DATABASES = {
    'default': {
        'ENGINE': 'django.db.backends.mysql',
        'NAME': os.getenv('DB_NAME', 'dpi_db'),
        'USER': os.getenv('DB_USER', 'root'),
        'PASSWORD': os.getenv('DB_PASSWORD', 'dpi'),
        'HOST': os.getenv('DB_HOST', 'localhost'),
        'PORT': os.getenv('DB_PORT', '3306'),
    }
}

# Validation des mots de passe
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

# Configuration des templates
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

# Application WSGI
WSGI_APPLICATION = 'gestion_dpi.wsgi.application'

# Internationalisation
LANGUAGE_CODE = 'en-us'
TIME_ZONE = 'UTC'
USE_I18N = True
USE_TZ = True

# Clé par défaut pour les champs de modèle
DEFAULT_AUTO_FIELD = 'django.db.models.BigAutoField'
