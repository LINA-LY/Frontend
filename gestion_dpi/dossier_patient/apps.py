from django.apps import AppConfig


class DossierPatientConfig(AppConfig):
    # Spécifie la configuration par défaut pour le champ ID automatique dans les modèles
    default_auto_field = 'django.db.models.BigAutoField'
    
    # Nom de l'application. Ce nom est utilisé pour identifier l'application dans le projet
    name = 'dossier_patient'
