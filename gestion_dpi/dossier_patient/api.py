from rest_framework import viewsets
from rest_framework.response import Response
from rest_framework.decorators import action
from rest_framework.parsers import MultiPartParser
from rest_framework import status
from .models import DossierMedical
from .serializers import DossierMedicalSerializer
from PIL import Image
import pyzbar.pyzbar as pyzbar


class DossierMedicalViewSet(viewsets.ViewSet):
    # Liste tous les dossiers médicaux existants dans la base de données
    def list(self, request):
        queryset = DossierMedical.objects.all()  # Récupère tous les objets de type DossierMedical
        serializer = DossierMedicalSerializer(queryset, many=True)  # Sérialise les données
        return Response(serializer.data)  # Retourne les données au format JSON

    # Crée un nouveau dossier médical à partir des données reçues
    def create(self, request):
        serializer = DossierMedicalSerializer(data=request.data)  # Sérialise les données reçues
        if serializer.is_valid():  # Vérifie que les données sont valides
            serializer.save()  # Sauvegarde le nouveau dossier médical dans la base
            return Response(serializer.data, status=status.HTTP_201_CREATED)  # Réponse avec le statut 201
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)  # Réponse avec les erreurs

    # Récupère un dossier médical spécifique grâce à son NSS
    def retrieve(self, request, pk=None):
        try:
            dossier = DossierMedical.objects.get(nss=pk)  # Recherche un dossier par NSS (clé primaire)
            serializer = DossierMedicalSerializer(dossier)  # Sérialise les données du dossier trouvé
            return Response(serializer.data)  # Retourne les données du dossier au format JSON
        except DossierMedical.DoesNotExist:  # Si le dossier n'existe pas
            return Response({'error': 'Dossier médical introuvable'}, status=status.HTTP_404_NOT_FOUND)  # Réponse 404
