import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';  // Import du module FormsModule

@Component({
  selector: 'app-bilan',
  templateUrl: './bilan.component.html',
  styleUrls: ['./bilan.component.scss'],
  standalone: true,  // Le composant autonome
  imports: [FormsModule],  // Ajout du module nécessaire
})
export class BilanComponent {
  bilan = {
    antecedents: '',
    observations: '',
    diagnostic: '',
  };

  enregistrerBilan() {
    console.log('Résumé enregistré :', this.bilan);
    alert('Résumé enregistré avec succès !');
  }

  annuler() {
    this.bilan = { antecedents: '', observations: '', diagnostic: '' };
    alert('L’édition du résumé a été annulée.');
  }
}




