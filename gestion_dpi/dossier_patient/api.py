#api.py
from rest_framework import viewsets
from rest_framework.response import Response
from rest_framework import status
from .models import DossierMedical, Patient 
from .serializers import DossierMedicalSerializer, PatientSerializer, SoinSerializer ,CompteRenduSerializer
from rest_framework.decorators import action


class DossierMedicalViewSet(viewsets.ViewSet):
    def list(self, request):
        queryset = DossierMedical.objects.select_related('patient').prefetch_related('soins').all()
        serialized_data = DossierMedicalSerializer(queryset, many=True)
        return Response(serialized_data.data)
    def create(self, request):
        patient_data = {
            'nss': request.data.get('nss'),
            'nom': request.data.get('nom'),
            'prenom': request.data.get('prenom'),
            'date_naissance': request.data.get('date_naissance'),
            'adresse': request.data.get('adresse'),
            'telephone': request.data.get('telephone'),
            'mutuelle': request.data.get('mutuelle'),
            'medecin': request.data.get('medecin'),
            'personne': request.data.get('personne'),
        }

        # Check for required fields
        required_fields = ['nss', 'nom', 'prenom', 'date_naissance', 'adresse', 'telephone', 'mutuelle','medecin','personne']
        for field in required_fields:
            if not request.data.get(field):
                return Response({'error': f"{field} is required."}, status=status.HTTP_400_BAD_REQUEST)

        try:
            # Get or create the patient
            patient, created = Patient.objects.get_or_create(nss=patient_data['nss'], defaults=patient_data)

            # Create the DossierMedical after ensuring the patient is retrieved or created
            dossier = DossierMedical.objects.create(patient=patient)

            return Response({
                'patient': PatientSerializer(patient).data,
                'qr_code': dossier.qr_code.url if dossier.qr_code else None,
            }, status=status.HTTP_201_CREATED)
        except Exception as e:
            # Log the error for debugging purposes
            import logging
            logger = logging.getLogger(__name__)
            logger.error(f"Error creating patient or dossier: {str(e)}")

            return Response({'error': str(e)}, status=status.HTTP_400_BAD_REQUEST)


    def retrieve(self, request, pk=None):
        try:
            patient = Patient.objects.get(nss=pk)
            dossier = DossierMedical.objects.get(patient=patient)
            serialized_data = DossierMedicalSerializer(dossier)
            return Response(serialized_data.data, status=status.HTTP_200_OK)
        except Patient.DoesNotExist:
            return Response({'error': 'Patient not found'}, status=status.HTTP_404_NOT_FOUND)
        except DossierMedical.DoesNotExist:
            return Response({'error': 'Medical record not found'}, status=status.HTTP_404_NOT_FOUND)

    @action(detail=True, methods=['post'])
    def ajouter_soin(self, request, pk=None):
            # Récupère le NSS depuis la requête
            nss = request.data.get('nss')  # On attend le NSS dans les données de la requête POST
            if not nss:
                return Response({'error': 'NSS manquant'}, status=status.HTTP_400_BAD_REQUEST)

            try:
                # Recherche le dossier médical via le NSS
                dossier = DossierMedical.objects.get(patient__nss=nss)
            except DossierMedical.DoesNotExist:
                return Response({'error': 'Dossier médical introuvable'}, status=status.HTTP_404_NOT_FOUND)

            # Serializer pour ajouter un soin
            serializer = SoinSerializer(data=request.data)
            if serializer.is_valid():
                serializer.save(dossier_medical=dossier)
                return Response(serializer.data, status=status.HTTP_201_CREATED)
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


    @action(detail=True, methods=['get'])
    def lister_soins(self, request, pk=None):
        # Récupère le NSS depuis la requête
        nss = request.query_params.get('nss')  # On attend le NSS dans les paramètres de la requête GET
        if not nss:
            return Response({'error': 'NSS manquant'}, status=status.HTTP_400_BAD_REQUEST)

        try:
            # Recherche le dossier médical via le NSS
            dossier = DossierMedical.objects.get(patient__nss=nss)
            soins = dossier.soins.all()
            serializer = SoinSerializer(soins, many=True)
            return Response(serializer.data, status=status.HTTP_200_OK)
        except DossierMedical.DoesNotExist:
            return Response({'error': 'Dossier médical introuvable'}, status=status.HTTP_404_NOT_FOUND)
    @action(detail=True, methods=['post'])
    def ajouter_compte_rendu(self, request, pk=None):
        # Récupère le NSS depuis la requête
        nss = request.data.get('nss')  # On attend le NSS dans les données de la requête POST
        if not nss:
            return Response({'error': 'NSS manquant'}, status=status.HTTP_400_BAD_REQUEST)

        try:
            # Recherche le dossier médical via le NSS
            dossier = DossierMedical.objects.get(patient__nss=nss)
        except DossierMedical.DoesNotExist:
            return Response({'error': 'Dossier médical introuvable'}, status=status.HTTP_404_NOT_FOUND)

        # Serializer pour ajouter un compte rendu
        serializer = CompteRenduSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save(dossier_medical=dossier)
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    @action(detail=True, methods=['get'])
    def lister_compte_rendus(self, request, pk=None):
        # Récupère le NSS depuis la requête
        nss = request.query_params.get('nss')  # On attend le NSS dans les paramètres de la requête GET
        if not nss:
            return Response({'error': 'NSS manquant'}, status=status.HTTP_400_BAD_REQUEST)

        try:
            # Recherche le dossier médical via le NSS
            dossier = DossierMedical.objects.get(patient__nss=nss)
            comptes_rendus = dossier.comptes_rendus.all()
            serializer = CompteRenduSerializer(comptes_rendus, many=True)
            return Response(serializer.data, status=status.HTTP_200_OK)
        except DossierMedical.DoesNotExist:
            return Response({'error': 'Dossier médical introuvable'}, status=status.HTTP_404_NOT_FOUND)