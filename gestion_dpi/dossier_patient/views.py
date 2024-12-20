# views.py

# Importation des modules nécessaires
from django.shortcuts import render, redirect  # pour gérer les vues et les redirections
from django.contrib import messages  # pour afficher des messages flash
import requests  # pour envoyer des requêtes HTTP

# URL de l'API pour l'accès aux dossiers médicaux
API_BASE_URL = "http://127.0.0.1:8000/dossier_patient/api/dossier-medical/"

# Vue pour créer un DPI
def create_dpi(request):
    if request.method == "POST":
        form_data = request.POST  # Récupère les données du formulaire
        data = {key: value for key, value in form_data.items()}  # Crée un dictionnaire avec les données
        
        # Envoie une requête POST à l'API pour créer un DPI
        response = requests.post(API_BASE_URL, json=data)

        if response.status_code == 201:  # Si la création a réussi
            messages.success(request, "DPI créé avec succès!")  # Message de succès
            nss = response.json().get('nss')  # Récupère le NSS du DPI créé
            if nss:
                return redirect('view_dpi', nss=nss)  # Redirige vers la vue du DPI
            else:
                messages.error(request, "Le NSS n'a pas été retourné.")  # Message d'erreur si le NSS manque
                return redirect('create_dpi')  # Redirige à nouveau vers la page de création
        else:
            error_message = response.json().get('error', "Une erreur s'est produite.")  # Message d'erreur si échec
            messages.error(request, f"Erreur lors de la création: {error_message}")  # Affiche l'erreur
    return render(request, 'create_dpi.html')  # Rendu de la page de création de DPI

# Vue pour afficher un DPI spécifique
def view_dpi(request, nss):
    response = requests.get(f"{API_BASE_URL}{nss}/")  # Envoie une requête GET pour obtenir le DPI par NSS
    if response.status_code == 200:  # Si le DPI est trouvé
        dossier_medical = response.json()  # Récupère les données du DPI
        return render(request, 'view_dpi.html', {'dossier_medical': dossier_medical})  # Rendu de la page de vue
    else:
        messages.error(request, "Dossier médical introuvable.")  # Affiche un message d'erreur si DPI non trouvé
        return redirect('create_dpi')  # Redirige vers la page de création de DPI

# Vue pour rechercher un DPI par NSS
def search_dpi(request):
    nss = request.GET.get('nss')  # Récupère le NSS de la barre de recherche
    if nss:
        response = requests.get(f"{API_BASE_URL}{nss}/")  # Envoie une requête GET pour chercher le DPI
        if response.status_code == 200:  # Si le DPI est trouvé
            dossier_medical = response.json()  # Récupère les données du DPI
            return render(request, 'search_dpi.html', {'dossier_medical': dossier_medical})  # Affiche le DPI
        else:
            return render(request, 'search_dpi.html', {'error': "Dossier médical introuvable."})  # Affiche une erreur si non trouvé
    return render(request, 'search_dpi.html')  # Rendu de la page de recherche de DPI si aucun NSS fourni
