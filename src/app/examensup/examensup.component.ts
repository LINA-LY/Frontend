import { Component } from '@angular/core';

@Component({
  selector: 'app-ordonnance',
  imports: [],
  templateUrl: './examensup.component.html',
  styleUrl: './examensup.component.scss'
})
export class ExamensupComponent {
   
   // Fonction appelée lors du clic sur "Enregistrer"
   enregistrer() {
     alert('Enregistrée avec succès !');
   }
 
   // Fonction appelée lors du clic sur "Annuler"
   annuler() {
     alert('L’édition a été annulée.');
   }

}

