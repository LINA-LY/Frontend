import { Component, OnInit, Inject, PLATFORM_ID } from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { Router } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { HttpClient } from '@angular/common/http';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-patient-interface',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './patient-interface.component.html',
  styleUrls: ['./patient-interface.component.css'],
})
export class PatientInterfaceComponent implements OnInit {
  dossierData: any = {};
  errorMessage: string = '';

  constructor(
    private router: Router,
    private authService: AuthService,
    private http: HttpClient,
    @Inject(PLATFORM_ID) private platformId: Object // Inject PLATFORM_ID
  ) {}

  ngOnInit(): void {
    if (isPlatformBrowser(this.platformId)) {
      const userDataString = localStorage.getItem('userData');
  
      // Check if userData exists and is valid JSON
      if (userDataString && userDataString !== 'undefined') {
        try {
          const userData = JSON.parse(userDataString);
          const userId = userData.id; // Replace 'id' with the actual property name for the user ID
  
          if (userId) {
            this.fetchNssByUserId(userId); // Fetch the NSS using the user ID
          } else {
            this.errorMessage = 'ID utilisateur non trouvé. Veuillez vous reconnecter.';
            console.error('ID utilisateur non trouvé');
            this.router.navigate(['/login']);
          }
        } catch (error) {
          console.error('Erreur lors de la lecture des données utilisateur:', error);
          this.errorMessage = 'Données utilisateur invalides. Veuillez vous reconnecter.';
          this.router.navigate(['/login']);
        }
      } else {
        this.errorMessage = 'Données utilisateur manquantes. Veuillez vous reconnecter.';
        console.error('Données utilisateur manquantes');
        this.router.navigate(['/login']);
      }
    }
  }
  // Fetch the NSS using the user ID
  fetchNssByUserId(userId: number): void {
    const apiUrl = `http://127.0.0.1:8000/api/get_nss_by_id/${userId}`;
    const headers = { 'Authorization': `Bearer ${localStorage.getItem('authToken')}` };

    this.http.get<{ nss: string }>(apiUrl, { headers }).subscribe({
      next: (response) => {
        const nss = response.nss;
        if (nss) {
          this.authService.setNss(nss); // Store the NSS in the AuthService
          this.fetchDossierMedical(nss); // Fetch the dossier using the NSS
        } else {
          this.errorMessage = 'NSS non trouvé pour cet utilisateur.';
          console.error('NSS non trouvé');
        }
      },
      error: (err) => {
        this.errorMessage = 'Erreur lors de la récupération du NSS. Veuillez réessayer plus tard.';
        console.error('Erreur lors de la récupération du NSS:', err);
      },
    });
  }

  // Fetch the patient's dossier using the NSS
  fetchDossierMedical(nss: string): void {
    const apiUrl = `http://127.0.0.1:8000/dossier_patient/api/dossier-medical/${nss}`;
    const headers = { 'Authorization': `Bearer ${localStorage.getItem('authToken')}` };

    this.http.get(apiUrl, { headers }).subscribe({
      next: (data) => {
        this.dossierData = data;
        console.log('Dossier médical récupéré:', this.dossierData);
      },
      error: (err) => {
        this.errorMessage = 'Erreur lors de la récupération du dossier médical. Veuillez réessayer plus tard.';
        console.error('Erreur lors de la récupération du dossier médical:', err);
      },
    });
  }

  onLogout(): void {
    this.authService.logout(); // Déconnectez l'utilisateur
    this.router.navigate(['/login']); // Redirigez vers la page de connexion
  }
}