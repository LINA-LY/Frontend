# views.py

# Importation des modules nécessaires
from django.shortcuts import render, redirect  # pour gérer les vues et les redirections
from django.contrib import messages  # pour afficher des messages flash
import requests  # pour envoyer des requêtes HTTP

# URL de l'API pour l'accès aux dossiers médicaux
API_BASE_URL = "http://127.0.0.1:8000/dossier_patient/api/dossier-medical/"

# Vue pour créer un DPI (Dossier Patient Informatisé)
def create_dpi(request):
    if request.method == "POST":
        form_data = request.POST  # Récupère les données du formulaire
        data = {key: value for key, value in form_data.items()}  # Convertit les données en dictionnaire

        # Envoie une requête POST à l'API pour créer le dossier médical
        response = requests.post(API_BASE_URL, json=data)

        if response.status_code == 201:  # Si la création est réussie
            messages.success(request, "Patient et dossier médical créés avec succès !")

            # Récupère les données de la réponse de l'API
            response_data = response.json()
            patient = response_data.get('patient', {})  # Récupère l'objet 'patient'
            nss = patient.get('nss')  # Récupère le NSS du patient

            if nss:  # Si le NSS est présent, redirige vers la vue du DPI
                return redirect('view_dpi', nss=nss)
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
    # Envoie une requête GET pour récupérer le dossier médical du patient en utilisant son NSS
    response = requests.get(f"{API_BASE_URL}{nss}/")
    if response.status_code == 200:
        dossier_medical = response.json()  # Récupère les données du dossier médical
        return render(request, 'view_dpi.html', {'dossier_medical': dossier_medical})  # Affiche les détails du DPI
    else:
        messages.error(request, "Dossier médical introuvable.")  # Affiche un message d'erreur si le dossier n'est pas trouvé
        return redirect('create_dpi')  # Redirige vers la page de création si le dossier est introuvable


# Vue pour rechercher un DPI par NSS
def search_dpi(request):
    nss = request.GET.get('nss')  # Récupère le NSS depuis les paramètres GET de la requête
    if nss:
        # Envoie une requête GET pour rechercher le DPI correspondant au NSS
        response = requests.get(f"{API_BASE_URL}{nss}/")
        if response.status_code == 200:
            dossier_medical = response.json()  # Récupère les données du dossier médical
            return render(request, 'search_dpi.html', {'dossier_medical': dossier_medical})  # Affiche les détails du DPI
        else:
            error_message = response.json().get('error', "Dossier médical introuvable.")
            return render(request, 'search_dpi.html', {'error': error_message})  # Affiche une erreur si le dossier n'est pas trouvé
    # Si aucun NSS n'est fourni, rend la page de recherche vide
    return render(request, 'search_dpi.html')
