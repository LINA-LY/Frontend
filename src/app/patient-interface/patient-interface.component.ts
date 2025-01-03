import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../services/auth.service';
@Component({
  selector: 'app-patient-interface',
 imports: [CommonModule, FormsModule],
  templateUrl: './patient-interface.component.html',
  styleUrls: ['./patient-interface.component.css'],
})
export class PatientInterfaceComponent {
  dossierData: any = {};
    constructor(private router: Router,private authService: AuthService,) {
      // Récupère les données transmises via l'état de la navigation
      const navigation = this.router.getCurrentNavigation();
      if (navigation?.extras.state) {
        this.dossierData = navigation.extras.state['dossierData'];
        console.log('Données du dossier :', this.dossierData);
      }
    }
    onLogout(): void {
      this.authService.logout(); // Déconnectez l'utilisateur
      this.router.navigate(['/login']); // Redirigez vers la page de connexion
    }

}
