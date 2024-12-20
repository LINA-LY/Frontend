from django import forms
from .models import DossierMedical

# Définition du formulaire pour créer ou modifier un Dossier Médical
class DPIForm(forms.ModelForm):
    class Meta:
        # Spécifie le modèle à utiliser pour générer le formulaire
        model = DossierMedical
        
        # Définit les champs du formulaire correspondant aux attributs du modèle
        fields = ['nss', 'nom', 'prenom', 'date_naissance', 'adresse', 'telephone', 'mutuelle']
