import { Component } from '@angular/core';
import { CommonModule } from '@angular/common'; // Pour les directives *ngIf et *ngFor
import { FormsModule } from '@angular/forms'; // Pour [(ngModel)]

@Component({
  selector: 'app-ordonnance',
  templateUrl: './ordonnance.component.html',
  styleUrls: ['./ordonnance.component.scss'],
  standalone: true,
  imports: [CommonModule, FormsModule], // Déclaration des modules requis
})
export class OrdonnanceComponent {
  // Propriété pour stocker temporairement les informations saisies
  nouveauMedicament = {
    nom: '',
    dosage: '',
    duree: '',
  };

  // Liste des médicaments ajoutés
  medicaments: { nom: string; dosage: string; duree: string }[] = [];

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
    if (this.medicaments.length > 0) {
      console.log('Ordonnance enregistrée :', this.medicaments);
      alert('Ordonnance enregistrée avec succès !');
    } else {
      alert('Aucun médicament à enregistrer.');
    }
  }

  // Fonction pour annuler l’édition
  annuler() {
    this.medicaments = [];
    alert('L’édition de l’ordonnance a été annulée.');
  }
}


