import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { OrdonnanceService } from '../services/ordonnance.service';

interface ApiResponse {
  success: boolean;
  message: string;
  data?: any; // Optionnel, selon la structure de la réponse
}

interface ApiError {
  status: number;
  message: string;
  error?: any; // Optionnel, selon la structure de l'erreur
}

@Component({
  selector: 'app-ordonnance',
  templateUrl: './ordonnance.component.html',
  styleUrls: ['./ordonnance.component.scss'],
  standalone: true,
  imports: [CommonModule, FormsModule], // Retirez HttpClientModule
})
export class OrdonnanceComponent {
  // Propriétés pour stocker les informations de l'ordonnance
  nss: string = '';
  date: string = '';

  // Propriété pour stocker temporairement les informations saisies
  nouveauMedicament = {
    nom: '',
    dosage: '',
    duree: '',
  };

  // Liste des médicaments ajoutés
  medicaments: { nom: string; dosage: string; duree: string }[] = [];

  // Injectez OrdonnanceService dans le constructeur
  constructor(private ordonnanceService: OrdonnanceService) {}

  // Fonction pour ajouter un médicament
  ajouterMedicament() {
    if (
      this.nouveauMedicament.nom &&
      this.nouveauMedicament.dosage &&
      this.nouveauMedicament.duree
    ) {
      this.medicaments.push({ ...this.nouveauMedicament });
      this.nouveauMedicament = { nom: '', dosage: '', duree: '' };
    } else {
      alert('Veuillez remplir tous les champs avant d’ajouter un médicament.');
    }
  }

  // Fonction pour enregistrer l’ordonnance
  enregistrerOrdonnance() {
    if (this.medicaments.length > 0 && this.nss && this.date) {
      const ordonnance = {
        nss: this.nss,
        date: this.date,
        medicaments: this.medicaments,
      };

      // Appel du service pour enregistrer l'ordonnance
      this.ordonnanceService.enregistrerOrdonnance(ordonnance).subscribe(
        (response: ApiResponse) => { // Utiliser l'interface ApiResponse
          console.log('Ordonnance enregistrée avec succès :', response);
          alert('Ordonnance enregistrée avec succès !');
          this.annuler(); // Réinitialiser le formulaire après l'enregistrement
        },
        (error: ApiError) => { // Utiliser l'interface ApiError
          console.error('Erreur lors de l’enregistrement de l’ordonnance :', error);
          alert('Erreur lors de l’enregistrement de l’ordonnance.');
        }
      );
    } else {
      alert('Veuillez remplir tous les champs et ajouter au moins un médicament.');
    }
  }

  // Fonction pour annuler l’édition
  annuler() {
    this.nss = '';
    this.date = '';
    this.medicaments = [];
    this.nouveauMedicament = { nom: '', dosage: '', duree: '' };
   
  }
}