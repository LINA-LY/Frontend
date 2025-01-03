import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';

@Component({
  selector: 'app-dossier-patient',
  templateUrl: './dossier-patient.component.html',
  styleUrls: ['./dossier-patient.component.css'],
  imports: [CommonModule, FormsModule],
})
export class DossierPatientComponent {
  dossierData: any = {}; // Stocke les données du dossier médical

  constructor(private router: Router) {
    // Récupère les données transmises via l'état de la navigation
    const navigation = this.router.getCurrentNavigation();
    if (navigation?.extras.state) {
      this.dossierData = navigation.extras.state['dossierData'];
      console.log('Données du dossier :', this.dossierData);
    }
  }

  // Méthode pour naviguer vers la page de rédaction du bilan
  redigerBilan() {
    this.router.navigate(['/examensup']);
  }
  redigerResumer() {
    this.router.navigate(['/bilan']);
  }
  redigerOrdannance() {
    this.router.navigate(['/ordonnance']);
  }
}