import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';  // Import du module FormsModule

@Component({
  selector: 'app-bilan',
  templateUrl: './soin.component.html',
  styleUrls: ['./soin.component.scss'],
  standalone: true,  // Le composant autonome
  imports: [FormsModule],  // Ajout du module nécessaire
})
export class SoinComponent {
  soin = {
    medicaments: '',
    soins_infirmiers: '',
    observations: '',
  };

  todayDate: string = new Date().toLocaleDateString('fr-FR');

  enregistrerSoin() {
    console.log('Soin enregistré :', this.soin);
    alert('Soin enregistré avec succès !');
  }

  annuler() {
    this.soin = { medicaments: '', soins_infirmiers: '', observations: '' };
    alert('L’édition du soin a été annulée.');
  }
}
