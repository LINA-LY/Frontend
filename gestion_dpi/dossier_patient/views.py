# views.py

# Importation des modules nécessaires
from django.shortcuts import render, redirect  # pour gérer les vues et les redirections
from django.contrib import messages  # pour afficher des messages flash
import requests  # pour envoyer des requêtes HTTP
from .models import DossierMedical, Soin ,CompteRendu
from django.http import HttpResponse, Http404,JsonResponse
from django.views.decorators.csrf import csrf_exempt



# URL de l'API pour l'accès aux dossiers médicaux
API_BASE_URL = "http://127.0.0.1:8000/dossier_patient/api/dossier-medical/"


def login(request):
    if request.method == "POST":
        # Get the form data (email, password)
        email = request.POST.get("email")
        password = request.POST.get("password")

        # Send the login credentials to the API
        data = {
            "email": email,
            "password": password
        }

        try:
            response = requests.post('http://127.0.0.1:8000/api/login/', json=data)
            response_data = response.json()

            if response.status_code == 200:  # If login is successful
                # Assuming the API sends back a JWT token
                token = response_data.get("token")
                nom = response_data.get("nom")
                prenom = response_data.get("prenom")
                role = response_data.get("role")
                id = response_data.get("id")
                
                if token:
                    # Store the token and other user details in session
                    request.session['auth_token'] = token  # Storing token in session
                    request.session['nom'] = nom  # Store nom in session
                    request.session['prenom'] = prenom  # Store prenom in session
                    request.session['role'] = role  # Store role in session
                    request.session['id'] = id

                    messages.success(request, "Login successful!")
                    return redirect('dashboard')  # Redirect to dashboard
                else:
                    messages.error(request, "Token missing from API response!")
                    return redirect('login')  # Redirect back to login if no token
            else:
                messages.error(request, f"Login failed: {response_data.get('error', 'Unknown error')}")
                return redirect('login')  # Redirect back to login if API returns an error

        except requests.exceptions.RequestException as e:
            messages.error(request, f"An error occurred: {str(e)}")
            return redirect('login')  # Redirect back to login if there is an exception

    # If GET request, render the login form
    return render(request, 'login.html')


###############
def logout(request):
    request.session.flush()  # Clear all session data
    messages.success(request, "You have logged out successfully.")
    return redirect('login')  # Redirect to the login page

def dashboard(request):
    # Retrieve user details from session
    nom = request.session.get('nom')
    prenom = request.session.get('prenom')
    role = request.session.get('role')
    id = request.session.get('id')

    # Check if the user is authenticated (has token in session)
    if not request.session.get('auth_token'):
        return redirect('login')  # Redirect to login if no token is found

    headers = get_auth_headers(request)

    try:
        # Fetch all dossiers from the API
        response = requests.get(API_BASE_URL, headers=headers)
        if response.status_code != 200:
            raise Exception("Error fetching dossiers from the API")

        # Get the data from the API response
        dossiers = response.json()

        # Check the role and render different templates accordingly
        if role == 'Medecin':
            return render(request, 'dashboard_medecin.html', {
                'nom': nom,
                'prenom': prenom,
                'role': role,
                'dossiers': dossiers,
                'id': id,
            })
            
        elif role == 'Patient':
            
            response = requests.get(f"http://127.0.0.1:8000/api/get_nss_by_id/{id}", headers=headers)
            response_nss = response.json() 
            nss=response_nss.get('nss')
            response = requests.get(f"{API_BASE_URL}{nss}/lister_dossier_complet/", headers=headers)
            dossier = response.json() 
            return render(request, 'dashboard_patient.html', {
                'nom': nom,
                'prenom': prenom,
                'role': role,
                'id': id,
                'dossier_data': dossier,  # You can adjust to only show patient-specific dossiers if needed
            })
            
        elif role == 'Radiologue':
            return render(request, 'dashboard_radiologue.html', {
                'nom': nom,
                'prenom': prenom,
                'role': role,
                'id': id,
                'dossiers': dossiers,  # Radiologue might need all dossiers or specific ones
            })
            
        elif role == 'Infirmier':
            return render(request, 'dashboard_infirmier.html', {
                'nom': nom,
                'prenom': prenom,
                'role': role,
                'id': id,
                'dossiers': dossiers,  # Infirmier dashboard with dossiers
            })
        elif role == 'Laborantin':
            # Filter DossierMedical where associated BilanBiologique has no glycimie, cholesteroel, or pression_arterielle
            dossiers_laborantin = DossierMedical.objects.filter(
                bilans__glycimie__isnull=True,
                bilans__cholesteroel__isnull=True,
                bilans__pression_arterielle__isnull=True
            )
            return render(request, 'dashboard_laborantin.html', {
                'nom': nom,
                'prenom': prenom,
                'role': role,
                'id': id,
                'dossiers': dossiers_laborantin,  # Only show dossiers with missing values
            })
        
        else:
            # If no valid role is found
            messages.error(request, "Role non valide.")
            return redirect('login')

    except Exception as e:
        # Handle errors if the API call fails or other issues
        messages.error(request, f"Erreur lors du chargement des dossiers: {str(e)}")
        return redirect('login')


def get_auth_headers(request):
    """Récupère les en-têtes d'authentification pour les requêtes API."""
    token = request.session.get('auth_token')
    if not token:
        raise PermissionError("Token manquant. L'utilisateur n'est pas authentifié.")
    return {
        "Authorization": f"Bearer {token}"
    }

#######################################
# Vue pour créer un DPI (Dossier Patient Informatisé)

def create_dpi(request):
    if not request.session.get('auth_token'):  # Vérifie si le token est présent
        return redirect('login')  # Redirige vers la page de connexion si non authentifié

    if request.method == "POST":
        form_data = request.POST  # Récupère les données du formulaire
        data = {key: value for key, value in form_data.items()}  # Convertit les données en dictionnaire

        headers = get_auth_headers(request)
        response = requests.post(API_BASE_URL, json=data, headers=headers)


        if response.status_code == 201:  # Si la création est réussie
            messages.success(request, "Patient et dossier médical créés avec succès !")

            # Récupère les données de la réponse de l'API
            response_data = response.json()
            patient = response_data.get('patient', {})  # Récupère l'objet 'patient'
            nss = patient.get('nss')  # Récupère le NSS du patient

            if nss:  # Si le NSS est présent, redirige vers la vue du DPI
                return redirect(f'/dossier_patient/search_dpi/?nss={nss}')
            else:
                messages.error(request, "Le NSS n'a pas été retourné par l'API.")  # Si NSS est manquant
                return redirect('create_dpi')  # Redirige vers la page de création

        else:  # Si une erreur survient
            error_message = response.json().get('error', "Une erreur s'est produite.")
            messages.error(request, f"Erreur lors de la création : {error_message}")
            return redirect('create_dpi')  # Redirige vers la page de création en cas d'erreur

    # Si la requête est GET, rend la page de création du DPI
    return render(request, 'create_dpi.html')


# Vue pour afficher un DPI spécifique

def view_dpi(request, nss):
    if not request.session.get('auth_token'):  # Vérifie si l'utilisateur est connecté
        return redirect('login')

    try:
        # Récupérer le token d'authentification
        headers = {
            "Authorization": f"Bearer {request.session.get('auth_token')}"
        }

        # Appeler l'API `lister_dossier_complet` avec le NSS
        response = requests.get(f"{API_BASE_URL}{nss}/lister_dossier_complet/", headers=headers)
        if response.status_code == 200:
            data = response.json()  # Récupérer les données du dossier médical complet
            return render(request, 'view_dpi.html', {'dossier_data': data})

        elif response.status_code == 403:  # Cas d'accès non autorisé
            messages.error(request, "Vous n'avez pas la permission de consulter ce dossier.")
            return redirect('dashboard')

        else:  # Si une erreur survient
            error_message = response.json().get('error', "Une erreur s'est produite.")
            messages.error(request, error_message)
            return redirect('dashboard')

    except requests.exceptions.RequestException as e:
        messages.error(request, f"Erreur de communication avec l'API : {str(e)}")
        return redirect('dashboard')

    
def search_dpi(request):
    if not request.session.get('auth_token'):  # Vérifie si le token est présent
        return redirect('login')  # Redirige vers la page de connexion si non authentifié

    nss = request.GET.get('nss')  # Récupère le NSS depuis les paramètres GET de la requête
    if nss:
        headers = get_auth_headers(request)
        response = requests.get(f"{API_BASE_URL}{nss}/lister_dossier_complet/", headers=headers)
        if response.status_code == 200:
            data = response.json()  # Récupère les données du dossier médical
            nom = request.session.get('nom')
            prenom = request.session.get('prenom')
            return render(request, 'dashboard_medecin.html', {'dossier_data': data ,'nom': nom, 'prenom': prenom})  # Affiche les détails du DPI
        else:
            error_message = response.json().get('error', "Dossier médical introuvable.")
            return render(request, 'dashboard_medecin.html', {'error': error_message})  # Affiche une erreur si le dossier n'est pas trouvé

    # Si aucun NSS n'est fourni, rend la page de recherche vide
    return render(request, 'dashboard_medecin.html')



#######################################################soin##########################################################################

# Vue pour ajouter un soin
def ajouter_soin(request, nss, nom, prenom):
    if not request.session.get('auth_token'):
        return redirect('login')  # Redirection vers la connexion si non authentifié

    headers = get_auth_headers(request)

    if request.method == "POST":
        form_data = request.POST  # Get form data
        data = {key: value for key, value in form_data.items()}  # Convert to dictionary

        try:
            # Envoi des données à l'API pour ajouter le soin
            soin_response = requests.post(f"{API_BASE_URL}{nss}/ajouter_soin/", json=data, headers=headers)

            # Vérification du statut de la réponse
            if soin_response.status_code == 201:  # Succès
                messages.success(request, "Soin ajouté avec succès !")
                return redirect('dashboard')  # Redirection vers le tableau de bord

            elif soin_response.status_code == 404:  # Ressource introuvable
                messages.error(request, "Erreur : Ressource introuvable. Vérifiez le NSS.")
            else:  # Autres erreurs
                try:
                    error_message = soin_response.json().get('error', "Une erreur s'est produite.")
                except requests.exceptions.JSONDecodeError:
                    error_message = "Erreur inconnue : La réponse de l'API n'est pas valide."
                messages.error(request, f"Erreur lors de l'ajout du soin : {error_message}")

        except requests.RequestException as e:
            # Gestion des exceptions de connexion ou d'autres erreurs réseau
            messages.error(request, f"Erreur de connexion à l'API : {str(e)}")

        # Si une erreur survient, rester sur la page actuelle
        return redirect('ajouter_soin', nss=nss, nom=nom, prenom=prenom)


    # Rendu de la page pour ajouter un soin
    return render(request, "ajouter_soin.html", {'nom': nom, 'prenom': prenom})


# Vue pour lister les soins
def lister_soins(request, nss):
    try:
        dossier = DossierMedical.objects.get(patient__nss=nss)
    except DossierMedical.DoesNotExist:
        raise Http404("Dossier médical introuvable")

    soins = dossier.soins.all()
    return render(request, 'soins.html', {'dossier': dossier, 'soins': soins})

# Vue pour ajouter un compte rendu
def ajouter_compte_rendu(request, nss, nom, prenom):
    if not request.session.get('auth_token'):
        return redirect('login')  # Redirection vers la connexion si non authentifié

    headers = get_auth_headers(request)

    if request.method == "POST":
        form_data = request.POST  # Récupérer les données du formulaire
        data = {key: value for key, value in form_data.items()}  # Convertir en dictionnaire

        try:
            # Envoi des données à l'API pour ajouter le compte rendu
            compte_rendu_response = requests.post(f"{API_BASE_URL}{nss}/ajouter_compte_rendu/", json=data, headers=headers)

            # Vérification du statut de la réponse
            if compte_rendu_response.status_code == 201:  # Succès
                messages.success(request, "Compte rendu ajouté avec succès !")
                return redirect('dashboard')  # Redirection vers le tableau de bord

            elif compte_rendu_response.status_code == 404:  # Ressource introuvable
                messages.error(request, "Erreur : Ressource introuvable. Vérifiez le NSS.")
            else:  # Autres erreurs
                try:
                    error_message = compte_rendu_response.json().get('error', "Une erreur s'est produite.")
                except requests.exceptions.JSONDecodeError:
                    error_message = "Erreur inconnue : La réponse de l'API n'est pas valide."
                messages.error(request, f"Erreur lors de l'ajout du compte rendu : {error_message}")

        except requests.RequestException as e:
            # Gestion des exceptions de connexion ou d'autres erreurs réseau
            messages.error(request, f"Erreur de connexion à l'API : {str(e)}")

        # Si une erreur survient, rester sur la page actuelle
        return redirect('ajouter_compte_rendu', nss=nss, nom=nom, prenom=prenom)


    # Rendu de la page pour ajouter un compte rendu
    return render(request, "ajouter_compte_rendu.html", {'nom': nom, 'prenom': prenom})

# Vue pour lister les comptes rendus
def lister_compte_rendus(request, nss):
    try:
        dossier = DossierMedical.objects.get(patient__nss=nss)
    except DossierMedical.DoesNotExist:
        raise Http404("Dossier médical introuvable")

    comptes_rendus = dossier.compte_rendus.all()
    return render(request, 'compte_rendus.html', {'dossier': dossier, 'comptes_rendus': comptes_rendus})

# Vue pour rédiger un résumé
def rediger_resume(request,nss):
    if not request.session.get('auth_token'):
        return redirect('login')  # Redirect if not authenticated

    if request.method == "POST":
        form_data = request.POST  # Get form data
        data = {key: value for key, value in form_data.items()}  # Convert to dictionary
        # Ajouter le nss au dictionnaire de données
        if nss:
            data['nss'] = nss  # Ajouter le NSS dans les données
        headers = get_auth_headers(request)
        response = requests.post('http://127.0.0.1:8000/api/resume', json=data, headers=headers)

        if response.status_code == 201:
            messages.success(request, "Résumé rédigé avec succès !")
            return redirect(f'/dossier_patient/search_dpi/?nss={nss}')
        else:
            error_message = response.json().get('error', "Une erreur s'est produite.")
            messages.error(request, f"Erreur lors de la rédaction : {error_message}")
            return redirect('rediger_resume')

    return render(request, 'rediger_resume.html')



# Vue pour rédiger un bilan
def rediger_bilan(request,nss):
    if not request.session.get('auth_token'):
        return redirect('login')

    if request.method == "POST":
        form_data = request.POST
        data = {key: value for key, value in form_data.items()}
        # Ajouter le nss au dictionnaire de données
        if nss:
            data['nss'] = nss  # Ajouter le NSS dans les données
        headers = get_auth_headers(request)
        response = requests.post('http://127.0.0.1:8000/api/bilan', json=data, headers=headers)

        if response.status_code == 201:
            messages.success(request, "Bilan rédigé avec succès !")
            return redirect(f'/dossier_patient/search_dpi/?nss={nss}')
        else:
            error_message = response.json().get('error', "Une erreur s'est produite.")
            messages.error(request, f"Erreur lors de la rédaction du bilan : {error_message}")
            return redirect('rediger_bilan')

    return render(request, 'rediger_bilan.html')

def remplir_bilan(request, id_bilan, nom, prenom):
    if not request.session.get('auth_token'):
        return redirect('login')

    if request.method == "POST":
        form_data = request.POST
        data = {key: value for key, value in form_data.items()}

        headers = get_auth_headers(request)
        try:
            # Debugging: Print the data being sent
            print("Data being sent:", data)

            response = requests.post(f"{API_BASE_URL}{id_bilan}/remplir_resultat_bilan/", json=data, headers=headers)

            # Debugging: Print response content
            print("Response Status Code:", response.status_code)
            print("Response Content:", response.text)

            if response.status_code == 200:
                try:
                    response_json = response.json()  # Try to parse as JSON
                    messages.success(request, "Bilan rempli avec succès !")
                    return redirect('dashboard')
                except ValueError:
                    messages.error(request, "Erreur : La réponse n'est pas au format JSON.")
                    return redirect('remplir_bilan', id_bilan=id_bilan , nom=nom , prenom =prenom)
            else:
                # Log the error message from the response
                error_message = response.text  # Get the actual error message
                messages.error(request, f"Erreur lors de la remplir du bilan : {error_message}")
                return redirect('remplir_bilan', id_bilan=id_bilan , nom=nom , prenom =prenom)

        except Exception as e:
            messages.error(request, f"Erreur lors de la requête : {str(e)}")
            return redirect('remplir_bilan', id_bilan=id_bilan)

    return render(request, 'remplir_bilan.html', {'id_bilan': id_bilan ,'nom': nom ,'prenom': prenom})


