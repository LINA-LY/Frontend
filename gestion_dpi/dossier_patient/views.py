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

# Vue pour créer un DPI (Dossier Patient Informatisé)
@csrf_exempt

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
@csrf_exempt

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
@csrf_exempt

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


#######################################################soin##########################################################################


def ajouter_soin(request, nss):
    # Récupère le dossier médical en utilisant le NSS
    try:
        dossier = DossierMedical.objects.get(patient__nss=nss)
    except DossierMedical.DoesNotExist:
        raise Http404("Dossier médical introuvable")

    if request.method == "POST":
        date = request.POST.get("date")
        medicaments_administres = request.POST.get("medicaments_administres")
        soins_infirmiers = request.POST.get("soins_infirmiers")
        observastions = request.POST.get("observastions")
        infirmier = request.POST.get("infirmier")
        
        if date and  medicaments_administres and soins_infirmiers and observastions and infirmier:
            Soin.objects.create(
                dossier_medical=dossier,
                date=date,
                medicaments_administres = medicaments_administres,
                soins_infirmiers = soins_infirmiers,
                observastions = observastions,
                infirmier=infirmier
            )
            return HttpResponse("Soin ajouté avec succès")
        else:
            return HttpResponse("Données incomplètes", status=400)

    return render(request, "ajouter_soin.html", {"dossier": dossier})
def lister_soins(request, nss):
    # Récupère le dossier médical en utilisant le NSS
    try:
        dossier = DossierMedical.objects.get(patient__nss=nss)
    except DossierMedical.DoesNotExist:
        raise Http404("Dossier médical introuvable")

    soins = dossier.soins.all()
    return render(request, 'soins.html', {'dossier': dossier, 'soins': soins})



# Vue pour ajouter un compte rendu
def ajouter_compte_rendu(request, nss):
    try:
        dossier = DossierMedical.objects.get(patient__nss=nss)
    except DossierMedical.DoesNotExist:
        raise Http404("Dossier médical introuvable")

    if request.method == "POST":
        date = request.POST.get("date")
        radiologue = request.POST.get("radiologue")
        description = request.POST.get("description")
        image_radio = request.FILES.get("image_radio")

        if date and radiologue:
            CompteRendu.objects.create(
                dossier_medical=dossier,
                date=date,
                radiologue=radiologue,
                description=description,
                image_radio=image_radio
            )
            return HttpResponse("Compte rendu ajouté avec succès")
        else:
            return HttpResponse("Données incomplètes", status=400)

    return render(request, "ajouter_compte_rendu.html", {"dossier": dossier})


# Vue pour lister les comptes rendus
def lister_compte_rendus(request, nss):
    try:
        dossier = DossierMedical.objects.get(patient__nss=nss)
    except DossierMedical.DoesNotExist:
        raise Http404("Dossier médical introuvable")

    comptes_rendus = dossier.compte_rendus.all()
    return render(request, 'compte_rendus.html', {'dossier': dossier, 'comptes_rendus': comptes_rendus})

