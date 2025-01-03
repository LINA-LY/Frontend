import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { BilanService } from '../services/bilan.service';

@Component({
  selector: 'app-bilan',
  templateUrl: './bilan.component.html',
  styleUrls: ['./bilan.component.scss'],
  standalone: true,
  imports: [FormsModule, CommonModule],
  providers: [BilanService], // Ajouter le service ici
})
export class BilanComponent {
  bilan = {
    date: new Date().toISOString().split('T')[0], // Date du jour par défaut
    nss: '', // Numéro de Sécurité Sociale
    medecin: '', // Nom du médecin
    antecedents: '',
    observations: '',
    diagnostic: '',
  };

  constructor(private bilanService: BilanService) {} // Injection du service

  // Méthode pour enregistrer le bilan
  enregistrerBilan() {
    this.bilanService.enregistrerBilan(this.bilan).subscribe({
      next: (response: any) => { // Définir le type de 'response'
        console.log('Résumé enregistré :', response);
        alert('Résumé enregistré avec succès !');
      },
      error: (error: any) => { // Définir le type de 'error'
        console.error('Erreur lors de l\'enregistrement :', error);
        alert('Erreur lors de l\'enregistrement du résumé.');
      },
    });
  }

  // Méthode pour annuler l'édition du bilan
  annuler() {
    this.bilan = {
      date: new Date().toISOString().split('T')[0],
      nss: '',
      medecin: '',
      antecedents: '',
      observations: '',
      diagnostic: '',
    };
    alert('L’édition du résumé a été annulée.');
  }
}