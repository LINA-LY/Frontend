# serializers.py
from rest_framework import serializers
from .models import DossierMedical

# Définition du serializer DossierMedicalSerializer pour transformer un objet DossierMedical en données JSON
class DossierMedicalSerializer(serializers.ModelSerializer):
    class Meta:
        # Définir le modèle que ce serializer va gérer
        model = DossierMedical
        # Liste des champs qui seront inclus dans la sérialisation (les données JSON renvoyées)
        fields = ['nss', 'nom', 'prenom', 'date_naissance', 'adresse', 'telephone', 'mutuelle', 'qr_code']
