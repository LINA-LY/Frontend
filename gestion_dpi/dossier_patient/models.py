from django.db import models
import qrcode
from io import BytesIO
from django.core.files import File

class DossierMedical(models.Model):
    nss = models.CharField(max_length=15, unique=True ,null=True)  # Numéro de Sécurité Sociale, unique
    nom = models.CharField(max_length=50, default="Nom inconnu")  # Nom avec une valeur par défaut
    prenom = models.CharField(max_length=50, default="Prénom inconnu")  # Prénom avec une valeur par défaut
    date_naissance = models.DateField(default="2000-01-01")  # Date de naissance par défaut
    adresse = models.TextField(default="Adresse inconnue")  # Adresse par défaut
    telephone = models.CharField(max_length=15, default="0000000000")  # Numéro de téléphone par défaut
    mutuelle = models.CharField(max_length=50, null=True, blank=True)  # Mutuelle facultative
    qr_code = models.ImageField(upload_to='qr_codes/', blank=True, null=True)  # QR Code facultatif
    
    def save(self, *args, **kwargs):
        # Générer un QR Code avant de sauvegarder
        qr_img = qrcode.make(self.nss)  # On utilise le NSS comme contenu
        buffer = BytesIO()
        qr_img.save(buffer, format='PNG')
        buffer.seek(0)
        self.qr_code.save(f'{self.nss}_qr.png', File(buffer), save=False)
        super().save(*args, **kwargs)

    def __str__(self):
        return f"{self.nom} {self.prenom} - {self.nss}"


