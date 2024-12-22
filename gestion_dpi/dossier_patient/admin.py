from django.contrib import admin

# Register your models here.
from .models import DossierMedical,Patient, Soin,CompteRendu

admin.site.register(DossierMedical)
admin.site.register(Patient)
admin.site.register(Soin)
admin.site.register(CompteRendu)


