from django.db import models
import qrcode
from io import BytesIO
from django.core.files import File

# Modèle pour représenter les dossiers médicaux des patients
class DossierMedical(models.Model):
    # Numéro de Sécurité Sociale, unique pour chaque patient
    nss = models.CharField(max_length=15, unique=True, null=True)

    # Nom du patient avec une valeur par défaut
    nom = models.CharField(max_length=50, default="Nom inconnu")
    
    # Prénom du patient avec une valeur par défaut
    prenom = models.CharField(max_length=50, default="Prénom inconnu")
    
    # Date de naissance avec une valeur par défaut
    date_naissance = models.DateField(default="2000-01-01")
    
    # Adresse résidentielle avec une valeur par défaut
    adresse = models.TextField(default="Adresse inconnue")
    
    # Numéro de téléphone avec une valeur par défaut
    telephone = models.CharField(max_length=15, default="0000000000")
    
    # Mutuelle ou assurance, facultatif
    mutuelle = models.CharField(max_length=50, null=True, blank=True)
    
    # Champ pour le QR Code, facultatif
    qr_code = models.ImageField(upload_to='qr_codes/', blank=True, null=True)
    
    # Méthode pour sauvegarder le modèle
    def save(self, *args, **kwargs):
        # Générer un QR Code basé sur le NSS
        qr_img = qrcode.make(self.nss)
        buffer = BytesIO()
        qr_img.save(buffer, format='PNG')  # Enregistrer le QR Code au format PNG
        buffer.seek(0)  # Réinitialiser le pointeur du buffer
        self.qr_code.save(f'{self.nss}_qr.png', File(buffer), save=False)  # Associer le fichier au champ qr_code
        super().save(*args, **kwargs)  # Appeler la méthode save() originale
    
    # Méthode pour afficher le modèle comme une chaîne lisible
    def __str__(self):
        return f"{self.nom} {self.prenom} - {self.nss}"
