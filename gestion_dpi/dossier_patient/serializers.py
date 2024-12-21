# serializers.py
from rest_framework import serializers
from .models import DossierMedical, Patient

class PatientSerializer(serializers.ModelSerializer):
    class Meta:
        model = Patient
 # Liste des champs qui seront inclus dans la sérialisation (les données JSON renvoyées)
        fields = ['nss', 'nom', 'prenom', 'date_naissance', 'adresse', 'telephone', 'mutuelle']

# Définition du serializer DossierMedicalSerializer pour transformer un objet DossierMedical en données JSON

class DossierMedicalSerializer(serializers.ModelSerializer):
    patient = PatientSerializer()  # Inclure le patient dans le serializer

    class Meta:
        model = DossierMedical
# Liste des champs qui seront inclus dans la sérialisation (les données JSON renvoyées)
        fields = ['patient', 'qr_code']
