import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { BilanMService } from '../services/BilanM.service';

@Component({
  selector: 'app-examensup',
  templateUrl: './examensup.component.html',
  styleUrls: ['./examensup.component.scss'],
  standalone: true,
  imports: [CommonModule, FormsModule], // Importez les modules nécessaires
})
export class ExamensupComponent {
  // Propriétés pour stocker les informations du bilan
  nss: string = ''; 
  description: string = ''; 

  // Injectez BilanMService dans le constructeur
  constructor(private bilanMService: BilanMService) {}

  // Fonction appelée lors du clic sur "Enregistrer"
  enregistrer() {
    if (this.nss && this.description) {
      const bilanData = {
        bilan_biologique: this.description,
      };

      // Appel du service pour rédiger le bilan
      this.bilanMService.redigerBilan(bilanData, this.nss).subscribe(
        (response: any) => {
          console.log('Bilan supplémentaire enregistré avec succès :', response);
          alert('Bilan supplémentaire enregistré avec succès !');
          this.annuler(); // Réinitialiser le formulaire après l'enregistrement
        },
        (error: any) => {
          console.error('Erreur lors de l’enregistrement du bilan :', error);
          alert('Erreur lors de l’enregistrement du bilan.');
        }
      );
    } else {
      alert('Veuillez remplir tous les champs avant d’enregistrer.');
    }
  }

  // Fonction appelée lors du clic sur "Annuler"
  annuler() {
    this.nss = '';
    this.description = '';
    alert('L’édition a été annulée.');
  }
}