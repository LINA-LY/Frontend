# serializers.py
from rest_framework import serializers
from .models import DossierMedical, Patient, Soin, CompteRendu

class SoinSerializer(serializers.ModelSerializer):
    class Meta:
        model = Soin
        fields = ['id', 'date', 'medicaments_administres','soins_infirmiers','observastions', 'infirmier']

class CompteRenduSerializer(serializers.ModelSerializer):
    class Meta:
        model = CompteRendu
        fields = ['id', 'date', 'radiologue', 'description', 'image_radio', 'dossier_medical']

class PatientSerializer(serializers.ModelSerializer):
    class Meta:
        model = Patient
        fields = ['nss', 'nom', 'prenom', 'date_naissance', 'adresse', 'telephone', 'mutuelle','medecin','personne']

class DossierMedicalSerializer(serializers.ModelSerializer):
    patient = PatientSerializer()  # Include the patient in the response

    class Meta:
        model = DossierMedical
        fields = ['patient', 'qr_code']
