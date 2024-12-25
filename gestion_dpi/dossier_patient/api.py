#api.py
from rest_framework import viewsets
from rest_framework.response import Response
from rest_framework import status
from .models import DossierMedical 
from utilisateurs.models import Patient ,Infirmier,Radiologue,Medecin,BilanBiologique,Traitement,Ordonnance
from utilisateurs.views import getUserFromToken
from utilisateurs.serializers import BilanBiologiqueSerializer,OrdonnanceSerializer ,TraitementSerializer
from .serializers import DossierMedicalSerializer, PatientSerializer, SoinSerializer ,CompteRenduSerializer

from rest_framework.decorators import action


class DossierMedicalViewSet(viewsets.ViewSet):
    def list(self, request):
        queryset = DossierMedical.objects.select_related('patient').prefetch_related('soins').all()
        serialized_data = DossierMedicalSerializer(queryset, many=True)
        return Response(serialized_data.data)
    def create(self, request):
        # Récupérer l'utilisateur connecté à partir du token
        user = getUserFromToken(request)
        if not isinstance(user, Medecin):  # Seul un médecin peut créer un dossier médical
            return Response({'error': 'Seuls les médecins peuvent créer un dossier médical.'}, status=status.HTTP_403_FORBIDDEN)

        patient_data = {
            'nss': request.data.get('nss'),
            'nom': request.data.get('nom'),
            'prenom': request.data.get('prenom'),
            'date_naissance': request.data.get('date_naissance'),
            'adresse': request.data.get('adresse'),
            'telephone': request.data.get('telephone'),
            'mutuelle': request.data.get('mutuelle'),
            'personne': request.data.get('personne'),
        }

        # Vérifier que tous les champs obligatoires sont présents
        required_fields = ['nss', 'nom', 'prenom', 'date_naissance', 'adresse', 'telephone', 'mutuelle', 'personne']
        for field in required_fields:
            if not request.data.get(field):
                return Response({'error': f"{field} est obligatoire."}, status=status.HTTP_400_BAD_REQUEST)

        try:
            # Récupérer ou créer le patient
            patient, created = Patient.objects.get_or_create(nss=patient_data['nss'], defaults=patient_data)

            # Associer le médecin traitant connecté au patient
            patient.medecin_traitant = user
            patient.save()  # Sauvegarder la modification du patient

            # Créer le dossier médical pour ce patient
            dossier = DossierMedical.objects.create(patient=patient)

            return Response({
                'patient': PatientSerializer(patient).data,
                'qr_code': dossier.qr_code.url if dossier.qr_code else None,
            }, status=status.HTTP_201_CREATED)
        except Exception as e:
            # Journaliser l'erreur pour le débogage
            import logging
            logger = logging.getLogger(__name__)
            logger.error(f"Erreur lors de la création du patient ou du dossier : {str(e)}")

            return Response({'error': str(e)}, status=status.HTTP_400_BAD_REQUEST)

    def retrieve(self, request, pk=None):
        try:
            # Fetch the patient using the NSS (primary key)
            patient = Patient.objects.get(nss=pk)

            # Retrieve the medical record (DossierMedical) associated with the patient
            dossier = DossierMedical.objects.get(patient=patient)

            # Serialize the data and return it
            serialized_data = DossierMedicalSerializer(dossier)
            return Response(serialized_data.data, status=status.HTTP_200_OK)
        
        except Patient.DoesNotExist:
            # If the patient doesn't exist, return a 404 error
            return Response({'error': 'Patient not found'}, status=status.HTTP_404_NOT_FOUND)
        
        except DossierMedical.DoesNotExist:
            # If the medical record doesn't exist for the patient, return a 404 error
            return Response({'error': 'Medical record not found'}, status=status.HTTP_404_NOT_FOUND)

    @action(detail=True, methods=['get'])
    def lister_dossier_complet(self, request, pk=None):
        try:
            # Fetch the patient using the NSS (primary key)
            patient = Patient.objects.get(nss=pk)

            # Retrieve the medical record (DossierMedical) associated with the patient
            dossier = DossierMedical.objects.get(patient=patient)

            # Retrieve related data
            bilans = dossier.bilans.all()
            soins = dossier.soins.all()
            comptes_rendus = dossier.compte_rendus.all()
            ordonnances = dossier.ordonnances.all()

            # Serialize the data
            dossier_serializer = DossierMedicalSerializer(dossier)  # Serialize the main DossierMedical instance
            bilan_serializer = BilanBiologiqueSerializer(bilans, many=True)
            soins_serializer = SoinSerializer(soins, many=True)
            compte_rendu_serializer = CompteRenduSerializer(comptes_rendus, many=True)
            ordonnance_serializer = OrdonnanceSerializer(ordonnances, many=True)

            # Return all related data along with the dossier data
            return Response({
                'dossier': dossier_serializer.data,  # Include the DossierMedical data
                'bilans': bilan_serializer.data,     # Include related bilans
                'soins': soins_serializer.data,      # Include related soins
                'comptes_rendus': compte_rendu_serializer.data,  # Include related comptes rendus
                'ordonnances': ordonnance_serializer.data  # Include related ordonnances
            }, status=status.HTTP_200_OK)

        except DossierMedical.DoesNotExist:
            return Response({'error': 'Dossier médical introuvable'}, status=status.HTTP_404_NOT_FOUND)


    @action(detail=True, methods=['post'])
    def ajouter_soin(self, request, pk=None):
        user = getUserFromToken(request, type=4)
        if not isinstance(user, Infirmier):
            return Response({'error': 'Only Infirmiers can add soins.'}, status=status.HTTP_403_FORBIDDEN)

        nss = request.data.get('nss')
        if not nss:
            return Response({'error': 'NSS manquant'}, status=status.HTTP_400_BAD_REQUEST)

        try:
            dossier = DossierMedical.objects.get(patient__nss=nss)
        except DossierMedical.DoesNotExist:
            return Response({'error': 'Dossier médical introuvable'}, status=status.HTTP_404_NOT_FOUND)

        serializer = SoinSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save(dossier_medical=dossier)
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    @action(detail=False, methods=['get'])
    def lister_soins(self, request):
        nss = request.query_params.get('nss')  # Retrieve NSS from query params
        if not nss:
            return Response({'error': 'NSS manquant'}, status=status.HTTP_400_BAD_REQUEST)

        try:
            dossier = DossierMedical.objects.get(patient__nss=nss)
            soins = dossier.soins.all()
            serializer = SoinSerializer(soins, many=True)
            return Response(serializer.data, status=status.HTTP_200_OK)
        except DossierMedical.DoesNotExist:
            return Response({'error': 'Dossier médical introuvable'}, status=status.HTTP_404_NOT_FOUND)


    @action(detail=True, methods=['post'])
    def ajouter_compte_rendu(self, request, pk=None):
        # Get the user from the token, ensuring the user is a Radiologue
        user = getUserFromToken(request, type=2)  # type=2 corresponds to Radiologue
        if not isinstance(user, Radiologue):
            return Response({'error': 'Only Radiologues can add compte rendu.'}, status=status.HTTP_403_FORBIDDEN)

        # Retrieve the NSS from the request data
        nss = request.data.get('nss')  # Expecting the NSS in the POST data
        if not nss:
            return Response({'error': 'NSS manquant'}, status=status.HTTP_400_BAD_REQUEST)

        try:
            # Search for the medical record using the NSS
            dossier = DossierMedical.objects.get(patient__nss=nss)
        except DossierMedical.DoesNotExist:
            return Response({'error': 'Dossier médical introuvable'}, status=status.HTTP_404_NOT_FOUND)

        # Serializer to add a compte rendu (medical report)
        serializer = CompteRenduSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save(dossier_medical=dossier)
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    @action(detail=False, methods=['get'])
    def lister_compte_rendus(self, request):
        # Retrieve the NSS from query parameters
        nss = request.query_params.get('nss')
        if not nss:
            return Response({'error': 'NSS manquant'}, status=status.HTTP_400_BAD_REQUEST)

        try:
            # Search for the DossierMedical using the NSS
            dossier = DossierMedical.objects.get(patient__nss=nss)

            # Retrieve all comptes rendus (medical reports) associated with the dossier
            comptes_rendus = dossier.compte_rendus.all()

            # Serialize the comptes rendus data
            serializer = CompteRenduSerializer(comptes_rendus, many=True)

            return Response(serializer.data, status=status.HTTP_200_OK)

        except DossierMedical.DoesNotExist:
            return Response({'error': 'Dossier médical introuvable'}, status=status.HTTP_404_NOT_FOUND)
        
        
        
    @action(detail=True, methods=['post'])
    def remplir_resultat_bilan(self, request, pk=None):
        # Check if the user is a Laborantin (Laboratory Technician)
        laborantin = getUserFromToken(request, 3)  # Assuming 3 represents Laborantin
        if laborantin is None:
            return Response({'error': 'Only Laborantins can fill in the results.'}, status=status.HTTP_403_FORBIDDEN)

        # Retrieve the Bilan ID from the request
        bid = request.data.get('bilan_id')
        if not bid:
            return Response({'error': 'Bilan ID is required.'}, status=status.HTTP_400_BAD_REQUEST)

        try:
            # Retrieve the Bilan instance based on the ID
            bilan = BilanBiologique.objects.get(id_bilan=bid)
        except BilanBiologique.DoesNotExist:
            return Response({'error': 'Bilan not found'}, status=status.HTTP_404_NOT_FOUND)

        # Check if the results are already filled in
        if bilan.result:
            return Response({'error': 'Results are already filled for this bilan.'}, status=status.HTTP_400_BAD_REQUEST)

        # Retrieve the result data from the request
        result_data = request.data.get('result')
        if not result_data:
            return Response({'error': 'Results data is required.'}, status=status.HTTP_400_BAD_REQUEST)

        # Update the Bilan with the new results and assign the Laborantin who filled in the results
        bilan.result = result_data
        bilan.laborantin = laborantin.id_utilisateur  # Store the Laborantin who filled in the result
        bilan.save()  # Save the changes made to the Bilan

        # Return a success response with the updated Bilan data
        return Response({
            "message": "Results updated successfully",
            "bilan_id": bilan.id_bilan,  # Assuming 'id_bilan' is the primary key field
            "result": result_data,
            "laborantin": laborantin.nom  # Return the Laborantin ID who filled in the result
        }, status=status.HTTP_200_OK)
        
    @action(detail=False, methods=['get'])
    def lister_bilans(self, request):
        # Retrieve the NSS from query parameters
        nss = request.query_params.get('nss')
        if not nss:
            return Response({'error': 'NSS manquant'}, status=status.HTTP_400_BAD_REQUEST)

        try:
            # Search for the DossierMedical using the NSS
            dossier = DossierMedical.objects.get(patient__nss=nss)

            # Retrieve all bilans associated with the dossier
            bilans = dossier.bilans.all()

            # Serialize the bilans data
            serializer = BilanBiologiqueSerializer(bilans, many=True)

            return Response(serializer.data, status=status.HTTP_200_OK)

        except DossierMedical.DoesNotExist:
            return Response({'error': 'Dossier médical introuvable'}, status=status.HTTP_404_NOT_FOUND)
        
        
#pour pharmacie

class OrdonnanceViewSet(viewsets.ModelViewSet):
    queryset = Ordonnance.objects.all()  # Récupérer toutes les ordonnances
    serializer_class = OrdonnanceSerializer

    @action(detail=False, methods=['get'])
    def lister_ordonnances(self, request):
        try:
            # Récupérer toutes les ordonnances
            ordonnances = Ordonnance.objects.all()

            # Récupérer les traitements associés à chaque ordonnance
            ordonnances_data = []
            for ordonnance in ordonnances:
                traitements = Traitement.objects.filter(ordonnance=ordonnance)
                traitements_data = TraitementSerializer(traitements, many=True).data

                ordonnance_data = {
                    'id_ordonnance': ordonnance.id_ordonnance,
                    'date': ordonnance.date,
                    'medecin': str(ordonnance.medecin),  # Nom du médecin
                    'dpi_patient': str(ordonnance.dpi_patient),  # Dossier du patient
                    'traitements': traitements_data  # Liste des traitements
                }

                ordonnances_data.append(ordonnance_data)

            return Response({
                'ordonnances': ordonnances_data
            }, status=status.HTTP_200_OK)

        except Exception as e:
            return Response({'error': str(e)}, status=status.HTTP_400_BAD_REQUEST)