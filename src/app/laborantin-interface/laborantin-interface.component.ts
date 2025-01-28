import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PatientService } from '../services/patient.service';
import { AuthService } from '../services/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-laborantin-interface', // Sélecteur du composant
  templateUrl: './laborantin-interface.component.html', // Template HTML associé
  styleUrls: ['./laborantin-interface.component.css'], // Fichier de style associé
  imports: [CommonModule], // Importation de CommonModule pour les fonctionnalités Angular de base
  standalone: true, // Indique que le composant est autonome
})
export class LaborantinInterfaceComponent implements OnInit {
  patients: any[] = []; // Tableau pour stocker les patients

  // Injection des services nécessaires
  constructor(
    private patientService: PatientService,
    private router: Router,
    private authService: AuthService
  ) {}

  // Méthode exécutée à l'initialisation du composant
  ngOnInit(): void {
    this.getPatients(); // Récupère les patients au chargement du composant
  }

  // Récupère les patients depuis le service
  getPatients(): void {
    this.patientService.getPatients().subscribe(
      (data) => {
        console.log('Données reçues de l\'API :', data); // Affiche les données reçues
        this.patients = data; // Stocke les patients dans le tableau
      },
      (error) => {
        console.error('Erreur lors de la récupération des patients', error); // Gère les erreurs
      }
    );
  }

  // Bascule le statut d'un patient entre 'oui' et 'non'
  toggleStatut(patient: any): void {
    patient.patient.statut = patient.patient.statut === 'non' ? 'oui' : 'non';
  }

  // Supprime un patient de la liste affichée
  effacer(patient: any): void {
    this.patients = this.patients.filter((p) => p !== patient);
  }

  // Déconnecte l'utilisateur et redirige vers la page de connexion
  onLogout(): void {
    this.authService.logout(); // Appelle la méthode de déconnexion du service d'authentification
    this.router.navigate(['/login']); // Redirige vers la page de connexion
  }

  // Redirige vers la page de rédaction de bilan
  redigerBilan(): void {
    this.router.navigate(['/laborantin']); // Utilisez la méthode navigate
  }
}