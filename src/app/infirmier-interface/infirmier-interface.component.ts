import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PatientService } from '../services/patient.service';
import { AuthService } from '../services/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-infirmier-interface',
  templateUrl: './infirmier-interface.component.html',
  styleUrls: ['./infirmier-interface.component.css'],
  imports: [CommonModule],
  standalone: true,
})
export class InfirmierInterfaceComponent implements OnInit {
  patients: any[] = [];

  constructor(private patientService: PatientService, private router: Router,
      private authService: AuthService,) {}

  ngOnInit(): void {
    this.getPatients();
  }

  getPatients(): void {
    this.patientService.getPatients().subscribe(
      (data) => {
        console.log('Données reçues de l\'API :', data); // Vérifiez les données ici
        this.patients = data;
      },
      (error) => {
        console.error('Erreur lors de la récupération des patients', error);
      }
    );
  }

  toggleStatut(patient: any): void {
    // Si vous souhaitez ajouter un statut, vous devrez peut-être le gérer côté backend
    patient.patient.statut = patient.patient.statut === 'non' ? 'oui' : 'non';
  }

  effacer(patient: any): void {
    this.patients = this.patients.filter(p => p !== patient);
  }
  onLogout(): void {
    this.authService.logout(); // Déconnectez l'utilisateur
    this.router.navigate(['/login']); // Redirigez vers la page de connexion
  }

  redigerBilan(): void {
    this.router.navigate(['/soin']); // Utilisez la méthode navigate
  }
}