# serializers.py
from rest_framework import serializers
from .models import DossierMedical, Soin, CompteRendu
from utilisateurs.serializers import PatientSerializer  # Import du serializer Patient

class SoinSerializer(serializers.ModelSerializer):
    class Meta:
        model = Soin
        fields = ['id', 'date', 'medicaments_administres','soins_infirmiers','observastions', 'infirmier']

class CompteRenduSerializer(serializers.ModelSerializer):
    class Meta:
        model = CompteRendu
        fields = ['id', 'date', 'radiologue', 'description', 'image_radio', 'dossier_medical']

class DossierMedicalSerializer(serializers.ModelSerializer):
    patient = PatientSerializer()  # Include the patient in the response

    class Meta:
        model = DossierMedical
        fields = ['patient', 'qr_code']
