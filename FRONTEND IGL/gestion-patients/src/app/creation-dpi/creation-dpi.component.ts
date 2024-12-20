import { Component } from '@angular/core';

@Component({
  selector: 'app-creation-dpi',
  templateUrl: './creation-dpi.component.html',
  styleUrls: ['./creation-dpi.component.css']
})
export class CreationDpiComponent {

  // Méthode pour la soumission
  onSubmit() {
    // Récupérer les valeurs des champs
    const numSecu = (<HTMLInputElement>document.getElementById('numSecu')).value;
    const nom = (<HTMLInputElement>document.getElementById('nom')).value;
    const prenom = (<HTMLInputElement>document.getElementById('prenom')).value;
    const dateNaissance = (<HTMLInputElement>document.getElementById('dateNaissance')).value;
    const adresse = (<HTMLInputElement>document.getElementById('adresse')).value;
    const telephone = (<HTMLInputElement>document.getElementById('telephone')).value;
    const mutuelle = (<HTMLInputElement>document.getElementById('mutuelle')).value;
    const medecin = (<HTMLInputElement>document.getElementById('medecin')).value;
    const urgence = (<HTMLInputElement>document.getElementById('urgence')).value;

    // Logique de soumission, par exemple envoyer les données au serveur
    console.log("DPI Créé:", { numSecu, nom, prenom, dateNaissance, adresse, telephone, mutuelle, medecin, urgence });
  }

  // Méthode pour annuler
  onCancel() {
    console.log('Annulation');
    // Vous pouvez réinitialiser les champs ou effectuer d'autres actions
  }
}
