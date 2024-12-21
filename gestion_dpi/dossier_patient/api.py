from rest_framework import viewsets
from rest_framework.response import Response
from rest_framework import status
from .models import DossierMedical, Patient
from .serializers import DossierMedicalSerializer, PatientSerializer

class DossierMedicalViewSet(viewsets.ViewSet):
    """
    ViewSet for managing medical records (DossierMedical) and related patients.
    """

    # List all medical records with associated patient data
    def list(self, request):
        queryset = DossierMedical.objects.select_related('patient').all()  # Include related Patient data
        serialized_data = DossierMedicalSerializer(queryset, many=True)
        return Response(serialized_data.data)  # Return serialized data as JSON

    # Create a new medical record and associate it with a patient
    def create(self, request):
        print(f"Received data: {request.data}")  # Log received data

        patient_data = {
            'nss': request.data.get('nss'),
            'nom': request.data.get('nom'),
            'prenom': request.data.get('prenom'),
            'date_naissance': request.data.get('date_naissance'),
            'adresse': request.data.get('adresse'),
            'telephone': request.data.get('telephone'),
            'mutuelle': request.data.get('mutuelle'),
        }
        print(f"Extracted patient data: {patient_data}")  # Log patient data

        try:
            # Create or retrieve the patient
            patient, created = Patient.objects.get_or_create(nss=patient_data['nss'], defaults=patient_data)
            print(f"Patient created: {created}, Patient: {patient}")  # Log patient creation status

            # Create the dossier medical
            dossier = DossierMedical.objects.create(patient=patient)
            print(f"Dossier created: {dossier}")  # Log dossier creation

            return Response({
                'patient': PatientSerializer(patient).data,
                'qr_code': dossier.qr_code.url if dossier.qr_code else None,
            }, status=status.HTTP_201_CREATED)

        except Exception as e:
            print(f"Error: {e}")  # Log the error
            return Response({'error': str(e)}, status=status.HTTP_400_BAD_REQUEST)

    # Retrieve a specific medical record by patient's NSS
    def retrieve(self, request, pk=None):
        try:
            # Find the patient by NSS
            patient = Patient.objects.get(nss=pk)
            # Retrieve the medical record associated with the patient
            dossier = DossierMedical.objects.get(patient=patient)

            # Serialize the medical record and patient data
            serialized_data = DossierMedicalSerializer(dossier)
            return Response(serialized_data.data, status=status.HTTP_200_OK)

        except Patient.DoesNotExist:
            return Response({'error': 'Patient not found'}, status=status.HTTP_404_NOT_FOUND)
        except DossierMedical.DoesNotExist:
            return Response({'error': 'Medical record not found'}, status=status.HTTP_404_NOT_FOUND)
