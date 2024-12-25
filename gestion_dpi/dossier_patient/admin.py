from django.contrib import admin
# Register your models here.
from .models import DossierMedical, Soin,CompteRendu
from utilisateurs.models import BilanBiologique, Resume,Ordonnance,Traitement,Medicament


admin.site.register(DossierMedical)
admin.site.register(Soin)
admin.site.register(CompteRendu)
admin.site.register(BilanBiologique)
admin.site.register(Resume)
admin.site.register(Ordonnance)
admin.site.register(Traitement)
admin.site.register(Medicament)




