import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-dossier-patient',
  templateUrl: './dossier-patient.component.html',
  styleUrls: ['./dossier-patient.component.css'],
  imports: [CommonModule, FormsModule],
  standalone: true,
})
export class DossierPatientComponent {
  dossierData: any = {}; // Stocke les données du dossier médical

  constructor(
    private router: Router,
    private authService: AuthService 
  ) {
    // Récupère les données transmises via l'état de la navigation
    const navigation = this.router.getCurrentNavigation();
    if (navigation?.extras.state) {
      this.dossierData = navigation.extras.state['dossierData'];
      console.log('Données du dossier :', this.dossierData);
    }
  }

    // Déconnecte l'utilisateur et redirige vers la page de connexion
    onLogout(): void {
      this.authService.logout(); // Appelle la méthode de déconnexion du service d'authentification
      this.router.navigate(['/login']); // Redirige vers la page de connexion
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