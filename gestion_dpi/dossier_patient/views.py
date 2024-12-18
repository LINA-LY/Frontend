from django.shortcuts import render, redirect
from .forms import DPIForm
from django.contrib import messages
from .models import DossierMedical

# Fonction de création du DPI
def create_dpi(request):
    if request.method == "POST":
        form = DPIForm(request.POST)
        if form.is_valid():
            dossier_medical = form.save()  # Sauvegarde le DPI dans la base
            messages.success(request, "DPI créé avec succès !")
            return redirect('view_dpi', nss=dossier_medical.nss)  # Redirige vers la consultation
        else:
            print("Form Errors:", form.errors)  # Ajoute ceci pour déboguer
            messages.error(request, "Erreur dans le formulaire. Veuillez vérifier vos informations.")
    else:
        form = DPIForm()
    return render(request, 'create_dpi.html', {'form': form})

# Fonction de consultation du DPI
def view_dpi(request, nss):
    try:
        dossier_medical = DossierMedical.objects.get(nss=nss)  # Récupère le DPI via le NSS
        return render(request, 'view_dpi.html', {'dossier_medical': dossier_medical})
    except DossierMedical.DoesNotExist:
        messages.error(request, "Dossier médical introuvable.")
        return redirect('create_dpi')  # Redirige vers la création si le DPI n'existe pas
