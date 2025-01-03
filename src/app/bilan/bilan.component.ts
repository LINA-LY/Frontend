import { Component } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms'; // Import des modules de formulaire
import { CommonModule } from '@angular/common'; // Pour utiliser *ngIf, *ngFor, etc.
import { RouterModule } from '@angular/router'; // Pour la navigation

@Component({
  selector: 'app-bilan',
  templateUrl: './bilan.component.html',
  styleUrls: ['./bilan.component.scss'],
  standalone: true, // Le composant est autonome
 imports: [FormsModule, CommonModule],
})
export class BilanComponent {
  bilan = {
    antecedents: '',
    observations: '',
    diagnostic: '',
  };

  // Méthode pour enregistrer le bilan
  enregistrerBilan() {
    console.log('Résumé enregistré :', this.bilan);
    alert('Résumé enregistré avec succès !'); // À remplacer par un service de notification
  }

  // Méthode pour annuler l'édition du bilan
  annuler() {
    this.bilan = { antecedents: '', observations: '', diagnostic: '' };
    alert('L’édition du résumé a été annulée.'); // À remplacer par un service de notification
  }
}