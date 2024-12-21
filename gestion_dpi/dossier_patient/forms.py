#forms.py
from django import forms
from .models import Patient
# Définition du formulaire pour créer ou modifier un patientet dpi
class DPIForm(forms.ModelForm):
    class Meta:
        model = Patient
# Définit les champs du formulaire correspondant aux attributs du modèle
        fields = ['nss', 'nom', 'prenom', 'date_naissance', 'adresse', 'telephone', 'mutuelle']
