from rest_framework.response import Response
from rest_framework.decorators import api_view
from rest_framework.views import APIView
import os
from .serializers import *
from rest_framework.parsers import JSONParser
from rest_framework.exceptions import AuthenticationFailed
from .models import *
import jwt, datetime
from datetime import datetime, timedelta
from rest_framework.permissions import IsAuthenticated, IsAdminUser, IsAuthenticatedOrReadOnly
from django.contrib.auth.hashers import check_password
from dossier_patient.models import DossierMedical
from rest_framework import status



def auth(request):
    token = request.headers.get('Authorization')
    
    if not token:
        raise AuthenticationFailed("Unauthenticated, missing token")

    # Ensure the token starts with "Bearer "
    if not token.startswith('Bearer '):
        raise AuthenticationFailed("Invalid token format, 'Bearer ' prefix missing")

    token = token.split(' ')[1]  # Extract the actual token

    secret_key = os.getenv('SECRET_KEY')
    if not secret_key:
        raise AuthenticationFailed("Server misconfiguration, missing secret key")
    
    try:
        # Decode the token and extract payload
        payload = jwt.decode(token, secret_key, algorithms=['HS256'])
        print(f"Decoded payload: {payload}")  # Debugging line
        return payload
    except jwt.ExpiredSignatureError:
        raise AuthenticationFailed("Unauthenticated, expired token")
    except jwt.DecodeError:
        raise AuthenticationFailed("Unauthenticated, invalid token")

def getUserFromToken(request, type=None):
    try:
        print("Inside getUserFromToken function")  # Debugging line

        # Fetch the token from the request
        token = request.headers.get('Authorization')
        if not token:
            raise AuthenticationFailed("Unauthenticated, missing token")
        
        # Ensure the token has the 'Bearer ' prefix
        if not token.startswith("Bearer "):
            raise AuthenticationFailed("Invalid token format, 'Bearer ' prefix missing")
        token = token.split(' ')[1]  # Extract the actual token

        # Decode the token
        secret_key = os.getenv('SECRET_KEY')
        if not secret_key:
            raise AuthenticationFailed("Server misconfiguration, missing secret key")

        payload = jwt.decode(token, secret_key, algorithms=['HS256'])  # Decode the token
        print(f"Decoded token payload: {payload}")  # Debugging: print the decoded payload

        # Validate the token payload
        if 'id' not in payload or 'type' not in payload:
            raise AuthenticationFailed("Token payload is missing required fields ('id' or 'type')")

        # Fetch the user dynamically based on its subclass
        user = None
        user_type = payload.get('type')
        user_id = payload.get('id')

        print(f"User ID: {user_id}, User Type: {user_type}")  # Debugging: print ID and type from payload

        if user_type == 'Medecin':
            print("Fetching Medecin object...")
            user = Medecin.objects.filter(id_utilisateur=user_id).first()
            print(f"Medecin fetched: {user}")
        elif user_type == 'Radiologue':
            print("Fetching Radiologue object...")
            user = Radiologue.objects.filter(id_utilisateur=user_id).first()
        elif user_type == 'Infirmier':
            print("Fetching Infirmier object...")
            user = Infirmier.objects.filter(id_utilisateur=user_id).first()
        elif user_type == 'Laborantin':
            print("Fetching Laborantin object...")
            user = Laborantin.objects.filter(id_utilisateur=user_id).first()
        elif user_type == 'Patient':
            print("Fetching Patient object...")
            user = Patient.objects.filter(id_utilisateur=user_id).first()
        elif user_type == 'Utilisateur':
            print("Fetching Utilisateur object...")
            user = Utilisateur.objects.filter(id_utilisateur=user_id).first()


    except Exception as e:
        print(f"Error encountered: {str(e)}")  # Catch all exceptions and print them for debugging
        raise AuthenticationFailed(f"An error occurred during authentication: {str(e)}")

    return user




# Create your views here.

# To register (add new user) -- classic jwt method
"""class RegisterView(APIView):

    def post(self, request):

        user = getUserFromToken(request)
        if user.is_staff == 0:
            raise AuthenticationFailed("Don't have the rights !!")
        # Verify also that the connected user is an instance from Administrative class using the token

        print("He's an admin")

        # On peut imaginer dans la requête le type de l'utilisateur en question
        # et selon ce type, on instancie la classe correspondante

        email = request.data['email']
        password = request.data['password']
        type = request.data['type']
        # 0: admin / 1: medecin / 2: Radiologue / 3: Laborantin / 4: Infirmier / autre: Erreur

        print(email, password)

        match type:
            case 0:
                user = Administratif.objects.filter(email=email).first()
            case 1:
                user = Medecin.objects.filter(email=email).first()
            case 2:
                user = Radiologue.objects.filter(email=email).first()
            case 3:
                user = Laborantin.objects.filter(email=email).first()
            case 4:
                user = Infirmier.objects.filter(email=email).first()
            case _:
                raise TypeError("Incorrect user type")


        if user is not None:
            raise AuthenticationFailed('User already signed up')
        data = request.data

        match type:
            case 0:
                serializer = AdministratifSerializer(data=data)  # NOTE: AdministratifSerializer
            case 1:
                serializer = MedecinSerializer(data=data)
            case 2:
                serializer = UtilisateurSerializer(data=data)  # NOTE: RadiologueSerializer
            case 3:
                serializer = UtilisateurSerializer(data=data)  # NOTE: LaborantinSerializer
            case 4:
                serializer = UtilisateurSerializer(data=data)  # NOTE: InfirmierSerializer
            case _:
                raise TypeError("Incorrect user type")
        if serializer.is_valid():
            serializer.save()
            # user = serializer.data.copy()

            response = Response()

            response.data = {
                "message": "User created successfully"
            }
            response.status_code = 201
            return response
            #return Response(serializer.data, status=201)
        return Response(serializer.errors)
"""

class LoginView(APIView):
    def post(self, request):
        email = request.data['email']
        password = request.data['password']

        print(f"Attempting to log in with email: {email}")

        # Step 1: Dynamically fetch the user by their subclass
        try:
            user = Utilisateur.objects.select_subclasses().filter(email=email).first()
            if user is None:
                raise AuthenticationFailed('User not found')
        except Exception as e:
            print(f"Error fetching user: {e}")
            raise AuthenticationFailed(f"Error fetching user: {e}")

        # Step 2: Verify the password
        try:
            if not check_password(password, user.password):
                raise AuthenticationFailed('Incorrect password')
        except Exception as e:
            print(f"Error verifying password: {e}")
            raise AuthenticationFailed(f"Error verifying password: {e}")

        # Step 3: Generate the JWT token
        try:
            payload = {
                'id': user.id_utilisateur,
                'type': user.get_user_type(),  # Dynamically resolved user type
                'exp': datetime.utcnow() + timedelta(days=2),
                'iat': datetime.utcnow()
            }

            print(f"Token payload: {payload}")

            token = jwt.encode(payload, os.getenv('SECRET_KEY'), algorithm='HS256')
            print(f"Generated token: {token}")
        except Exception as e:
            print(f"Error generating token: {e}")
            raise AuthenticationFailed(f"Error generating token: {e}")

        # Step 4: Prepare and send the response
        try:
            response = Response()
            response.set_cookie(key='jwt', value=token, httponly=True)
            response.data = {
                "token": token,
                "id": user.id_utilisateur,
                "nom": user.nom,
                "prenom": user.prenom,
                "email": user.email,
                 "role": user.get_user_type(),  # Added role information

            }
            return response
        except Exception as e:
            print(f"Error preparing response: {e}")
            raise AuthenticationFailed(f"Error preparing response: {e}")

@api_view(['POST'])
def rediger_ordonnance(request):

    user = getUserFromToken(request)  # For example, type 2 is for Radiologue
    if not isinstance(user, Medecin):
        return Response({'error': 'Only Medecins can add compte rendu.'}, status=status.HTTP_403_FORBIDDEN)

    patient_nss = request.data['nss']
    patient = Patient.objects.filter(nss=patient_nss).first()
    if not patient:
        raise AuthenticationFailed("Patient does not exist, you need to add it first")
    # print(patient.__str__())

    dpi = DossierMedical.objects.filter(patient=patient.id_utilisateur).first()
    if not dpi:
        raise AuthenticationFailed("DPI for this patient does not exist, you need to add it first")
    # print(dpi.__str__())

    date = request.data['date']
    medicaments = request.data['medicaments']

    data = {
        "date": date,
        "medecin": user.id_utilisateur,
        "dpi_patient": dpi.id,
        "medicaments": medicaments
    }

    serializer = OrdonnanceSerializer(data=data)
    if not serializer.is_valid():
        return Response(serializer.errors)
    serializer.save()

    response = Response()
    response.data = {
        "message": "Ordonnance created successfully",
        "medecin": user.nom,
        "medicaments": medicaments
    }
    response.status_code = 201
    return response
    # return Response(serializer.data, status=201)

@api_view(['POST'])
def rediger_resume(request):
    user = getUserFromToken(request)  # For example, type 2 is for Radiologue
    if not isinstance(user, Medecin):
        return Response({'error': 'Only Medecins can add compte rendu.'}, status=status.HTTP_403_FORBIDDEN)


    patient_nss = request.data['nss']
    patient = Patient.objects.filter(nss=patient_nss).first()
    if not patient:
        raise AuthenticationFailed("Patient does not exist, you need to add it first")

    dpi = DossierMedical.objects.filter(patient=patient.id_utilisateur).first()
    if not dpi:
        raise AuthenticationFailed("DPI for this patient does not exist, you need to add it first")

    data = {
        "date": request.data['date'],
        "observations": request.data['observations'],
        "diagnostic": request.data['diagnostic'],
        "antecedents": request.data['antecedents'],
        "dpi": dpi.id,
        "medecin": user.id_utilisateur
    }
    serializer = ResumeSerializer(data=data)

    if serializer.is_valid():
        serializer.save()
        response = Response()

        response.data = {
            "message": "Resume created successfully",
            "medecin": user.nom
        }
        response.status_code = 201
        return response
    return Response(serializer.errors)

@api_view(['POST'])
def rediger_bilan(request):
    user = getUserFromToken(request) 
    if not isinstance(user, Medecin):
        return Response({'error': 'Only Medecins can add compte rendu.'}, status=status.HTTP_403_FORBIDDEN)

    patient_nss = request.data['nss']
    patient = Patient.objects.get(nss=patient_nss)
    if not patient:
        raise AuthenticationFailed("Patient does not exist, you need to add it first")

    dpi = DossierMedical.objects.get(patient=patient.id_utilisateur)
    if not dpi:
        raise AuthenticationFailed("DPI for this patient does not exist, you need to add it first")

    data = {
        "date": request.data['date'],
        "description": request.data['description'],
        "dpi": dpi.id,
        "medecin": user.id_utilisateur
    }

    serializer = BilanBiologiqueSerializer(data=data)

    if serializer.is_valid():
        serializer.save()
        response = Response()

        response.data = {
            "message": "Bilan created successfully",
            "description": data['description'],
        }
        response.status_code = 201
        return response
    return Response(serializer.errors)


@api_view(['GET'])
def get_nss_by_id(request, patient_id):
    try:
        # Assuming you have a Patient model with 'id' and 'nss' fields
        patient = Patient.objects.get(id_utilisateur=patient_id)  # Get patient by ID
        return Response({"nss": patient.nss}, status=status.HTTP_200_OK)
    except Patient.DoesNotExist:
        # If the patient does not exist, return an error message
        return Response({"error": "Patient not found."}, status=status.HTTP_404_NOT_FOUND)
    except Exception as e:
        # Handle other possible exceptions
        return Response({"error": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
