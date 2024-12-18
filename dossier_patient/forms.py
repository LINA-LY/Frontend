from django import forms
from .models import DossierMedical

class DPIForm(forms.ModelForm):
    class Meta:
        model = DossierMedical
        fields = ['nss', 'nom', 'prenom', 'date_naissance', 'adresse', 'telephone', 'mutuelle']
