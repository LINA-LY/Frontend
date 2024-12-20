# URL configuration for the gestion_dpi project

# Importation des modules nécessaires
from django.contrib import admin  # pour la gestion de l'interface admin
from django.urls import path, include  # pour définir les routes d'URL
from django.conf import settings  # pour accéder aux paramètres de configuration du projet
from django.conf.urls.static import static  # pour gérer les fichiers statiques et médias

# Définition des URLs du projet
urlpatterns = [
    # Route pour accéder à l'interface d'administration Django
    path('admin/', admin.site.urls),
    
    # Inclut les URLs définies dans l'application 'dossier_patient'
    path('dossier_patient/', include('dossier_patient.urls')),
]

# Ajoute les configurations pour servir les fichiers médias (images, vidéos, etc.) pendant le développement
urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
