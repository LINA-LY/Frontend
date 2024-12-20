import { Component } from '@angular/core';

@Component({
  selector: 'app-ordonnance',
  imports: [],
  templateUrl: './ordonnance.component.html',
  styleUrl: './ordonnance.component.scss'
})
export class OrdonnanceComponent {
   // Propriété pour les médicaments
   medicaments: { nom: string; dosage: string; duree: string }[] = [];

   // Fonction appelée lors du clic sur "Ajouter un médicament"
   ajouterMedicament() {
     this.medicaments.push({ nom: '', dosage: '', duree: '' });
   }
 
   // Fonction appelée lors du clic sur "Enregistrer l'ordonnance"
   enregistrerOrdonnance() {
     console.log('Ordonnance enregistrée :', this.medicaments);
     alert('Ordonnance enregistrée avec succès !');
   }
 
   // Fonction appelée lors du clic sur "Annuler"
   annuler() {
     this.medicaments = [];
     alert('L’édition de l’ordonnance a été annulée.');
   }

}
