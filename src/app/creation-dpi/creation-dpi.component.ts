import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { DpiService } from '../services/dpi.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-create-dpi',
  standalone: true, // Utilisation de composants autonomes (Angular 14+)
  imports: [CommonModule, FormsModule], // Importation des modules nécessaires
  templateUrl: './creation-dpi.component.html', // Lien vers le template HTML
  styleUrls: ['./creation-dpi.component.css'], // Lien vers les styles CSS
})
export class CreateDpiComponent {
  submitted = false; // Indicateur de soumission du formulaire

  // Objet pour stocker les données du formulaire
  dpiData = {
    nss: '',
    nom: '',
    prenom: '',
    date_naissance: '',
    adresse: '',
    telephone: '',
    mutuelle: '',
    email: '',
    medecin_traitant: '',
    personne: '',
  };

  // Injection des services nécessaires
  constructor(
    private dpiService: DpiService, // Service pour créer un DPI
    private router: Router, // Service de navigation
  ) {}

  // Méthode appelée lors de la soumission du formulaire
  onSubmit(): void {
    this.submitted = true;

    // Validation des champs obligatoires
    if (
      !this.dpiData.nss ||
      !this.dpiData.nom ||
      !this.dpiData.prenom ||
      !this.dpiData.date_naissance ||
      !this.dpiData.adresse ||
      !this.dpiData.telephone ||
      !this.dpiData.mutuelle ||
      !this.dpiData.medecin_traitant ||
      !this.dpiData.personne
    ) {
      alert('Veuillez remplir tous les champs obligatoires.'); // Affiche une alerte si des champs sont manquants
      return;
    }

    // Appel au service pour créer le DPI
    this.dpiService.createDpi(this.dpiData).subscribe({
      next: (response) => {
        const nss = response.patient?.nss; // Récupère le NSS de la réponse
        if (nss) {
          // Redirige vers la page de recherche DPI avec le NSS en paramètre
          this.router.navigate(['/medecin-interface-start']);
          alert('DPI créé avec succès !'); // Affiche un message de succès
        } else {
          alert('Erreur lors de la création du DPI, NSS manquant.'); // Affiche une erreur si le NSS est manquant
        }
      },
      error: (err) => {
        console.error(err); // Log l'erreur dans la console
        if (err.status === 401) {
          alert('Vous n\'êtes pas autorisé à effectuer cette action.'); // Affiche une erreur d'autorisation
        } else if (err.status === 400) {
          alert('Données invalides. Veuillez vérifier les informations saisies.'); // Affiche une erreur de validation
        } else {
          alert('Une erreur est survenue. Veuillez réessayer plus tard.'); // Affiche une erreur générique
        }
      },
    });
  }

  // Méthode pour annuler et revenir à la page précédente
  onCancel(): void {
    this.router.navigate(['/medecin-interface-start']);
  }
}