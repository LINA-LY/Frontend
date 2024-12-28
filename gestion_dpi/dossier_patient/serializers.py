# serializers.py
from rest_framework import serializers
from .models import DossierMedical, Soin, CompteRendu
from utilisateurs.serializers import PatientSerializer,UtilisateurSerializer  # Import du serializer Patient

class SoinSerializer(serializers.ModelSerializer):
    infirmier = UtilisateurSerializer(read_only=True)  # Mark as read-only because we don't want to accept it in the request data

    class Meta:
        model = Soin
        fields = ['id', 'date', 'medicaments_administres', 'soins_infirmiers', 'observations', 'infirmier']

    def create(self, validated_data):
        # Pop 'infirmier' from the validated data since it's automatically handled in the view
        soin = Soin.objects.create(**validated_data)
        return soin

class CompteRenduSerializer(serializers.ModelSerializer):
    radiologue = UtilisateurSerializer(read_only=True)  # Mark as read-only because we don't want to accept it in the request data

    class Meta:
        model = CompteRendu
        fields = ['id', 'date', 'radiologue', 'description', 'image_radio']

    def create(self, validated_data):
        # Pop 'infirmier' from the validated data since it's automatically handled in the view
        compteRendu = CompteRendu.objects.create(**validated_data)
        return compteRendu


class DossierMedicalSerializer(serializers.ModelSerializer):
    patient = PatientSerializer()  # Include the patient in the response

    class Meta:
        model = DossierMedical
        fields = ['patient', 'qr_code']
