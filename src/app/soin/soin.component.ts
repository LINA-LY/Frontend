import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';  // Import du module FormsModule
import { CommonModule } from '@angular/common';  // Import du module CommonModule

@Component({
  selector: 'app-bilan',
  templateUrl: './soin.component.html',
  styleUrls: ['./soin.component.scss'],
  standalone: true,  // Le composant autonome
  imports: [FormsModule, CommonModule],  // Ajout des modules nécessaires
})
export class SoinComponent {
  soin = {
    nomPatient: '', // Nouveau champ
    infirmier: '',  // Nouveau champ
    medicaments: '',
    soins_infirmiers: '',
    observations: '',
  };

  todayDate: string = new Date().toLocaleDateString('fr-FR');

  enregistrerSoin() {
    // Vérifier si tous les champs obligatoires sont remplis
    if (
      this.soin.nomPatient &&
      this.soin.infirmier &&
      this.soin.medicaments &&
      this.soin.soins_infirmiers &&
      this.soin.observations
    ) {
      console.log('Soin enregistré :', this.soin);
      alert('Soin enregistré avec succès !');

      // Réinitialiser le formulaire après enregistrement
      this.soin = {
        nomPatient: '',
        infirmier: '',
        medicaments: '',
        soins_infirmiers: '',
        observations: '',
      };
    } else {
      alert('Veuillez remplir tous les champs obligatoires.');
    }
  }

  annuler() {
    this.soin = {
      nomPatient: '',
      infirmier: '',
      medicaments: '',
      soins_infirmiers: '',
      observations: '',
    };
    alert('L’édition du soin a été annulée.');
  }
}