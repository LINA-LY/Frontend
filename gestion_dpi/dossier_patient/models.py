from django.db import models
import qrcode
from io import BytesIO
from django.core.files import File

# Modèle pour représenter les patients
class Patient(models.Model):
    # Numéro de Sécurité Sociale, unique pour chaque patient
    nss = models.CharField(max_length=15, unique=True, null=True)

    # Nom du patient
    nom = models.CharField(max_length=50, default="Nom inconnu")

    # Prénom du patient
    prenom = models.CharField(max_length=50, default="Prénom inconnu")

    # Date de naissance
    date_naissance = models.DateField(default="2000-01-01")

    # Adresse résidentielle
    adresse = models.TextField(default="Adresse inconnue")

    # Numéro de téléphone
    telephone = models.CharField(max_length=15, default="0000000000")

    # Mutuelle ou assurance, facultatif
    mutuelle = models.CharField(max_length=50, null=True, blank=True)

    def __str__(self):
        return f"{self.nom} {self.prenom} - {self.nss}"



class Soin(models.Model):
    # Identifiant unique pour chaque soin (géré automatiquement par Django)
    id = models.AutoField(primary_key=True)

    # Date à laquelle le soin a été effectué
    date = models.DateField()

    # Description du soin
    medicaments_administres = models.TextField()
    soins_infirmiers = models.TextField()
    observastions = models.TextField()


    # Nom ou identifiant de l'infirmier ayant réalisé le soin
    infirmier = models.CharField(max_length=100)

    # Référence au DossierMedical auquel ce soin appartient
    dossier_medical = models.ForeignKey(
        'DossierMedical',
        on_delete=models.CASCADE,  # Si le dossier médical est supprimé, supprimer aussi les soins
        related_name='soins'
    )

    def __str__(self):
        return f"Soin ID: {self.id}, Date: {self.date}, Infirmier: {self.infirmier}"



class CompteRendu(models.Model):
    id = models.AutoField(primary_key=True)
    dossier_medical = models.ForeignKey(
        'DossierMedical',
        on_delete=models.CASCADE,  # Si le dossier médical est supprimé, supprimer aussi les soins
        related_name='compte_rendus'
    )    
    date = models.DateField()
    radiologue = models.CharField(max_length=255)
    description = models.TextField()
    image_radio = models.ImageField(upload_to='radio_images/', null=True, blank=True)  # Optional image (e.g., X-ray)

    def __str__(self):
        return f"Compte rendu ID: {self.id}, Date: {self.date}, radiologue: {self.radiologue}"



# Modèle pour représenter les dossiers médicaux liés à un patient
class DossierMedical(models.Model):
    # Référence au modèle Patient
    patient = models.OneToOneField(
    Patient,
    on_delete=models.CASCADE,
    related_name="dossier_medical",
    default=1  # ID du patient par défaut
)


    # Champ pour le QR Code, facultatif
    qr_code = models.ImageField(upload_to='qr_codes/', blank=True, null=True)
    
    # Méthode pour sauvegarder le modèle
    def save(self, *args, **kwargs):
        # Générer un QR Code basé sur le NSS
        qr_img = qrcode.make(self.patient.nss)
        buffer = BytesIO()
        qr_img.save(buffer, format='PNG')  # Enregistrer le QR Code au format PNG
        buffer.seek(0)  # Réinitialiser le pointeur du buffer
        self.qr_code.save(f'{self.patient.nss}_qr.png', File(buffer), save=False)  # Associer le fichier au champ qr_code
        super().save(*args, **kwargs)  # Appeler la méthode save() originale
    
    # Méthode pour afficher le modèle comme une chaîne lisible
    def __str__(self):
        return f"{self.patient.nom} {self.patient.prenom} - {self.patient.nss}"
