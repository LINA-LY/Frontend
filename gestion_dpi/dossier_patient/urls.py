# urls.py

# Importation des modules nécessaires
from django.urls import path, include
from rest_framework.routers import DefaultRouter
from . import views
from .api import DossierMedicalViewSet

# Création d'un routeur pour gérer les routes de l'API
router = DefaultRouter()

# Enregistrement de la route 'dossier-medical' pour l'API
router.register(r'dossier-medical', DossierMedicalViewSet, basename='dossier-medical')

# Définition des routes classiques et API
urlpatterns = [
    # Route pour créer un DPI
    path('', views.create_dpi, name='create_dpi'),
    
    # Route pour afficher un DPI selon le NSS
    path('dpi/<str:nss>/', views.view_dpi, name='view_dpi'),
    
    # Route pour rechercher un DPI
    path('search_dpi/', views.search_dpi, name='search_dpi'),  # <-- This remains as is

    path('ajouter_soin/<str:nss>/', views.ajouter_soin, name='ajouter_soin'),
    path('lister_soins/<str:nss>/', views.lister_soins, name='lister_soins'),

    path('ajouter-compte-rendu/<str:nss>/', views.ajouter_compte_rendu, name='ajouter_compte_rendu'),
    path('compte-rendus/<str:nss>/', views.lister_compte_rendus, name='lister_compte_rendus'),

    
    # Route pour l'API qui inclut toutes les routes générées automatiquement
    path('api/', include(router.urls)),
]
