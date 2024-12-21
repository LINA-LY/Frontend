from django.contrib import admin

# Register your models here.
from .models import DossierMedical,Patient

admin.site.register(DossierMedical)
admin.site.register(Patient)

