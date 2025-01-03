import { Component } from '@angular/core';
import { CommonModule } from '@angular/common'; // Nécessaire pour *ngFor et *ngIf

@Component({
  selector: 'app-infirmier-interface',
  templateUrl: './infirmier-interface.component.html',
  styleUrls: ['./infirmier-interface.component.css'],
  imports: [CommonModule], // Ajoute CommonModule ici
  standalone: true, // Active les composants autonomes si ton projet supporte cela
})
export class InfirmierInterfaceComponent {
  patients = [
    { name: 'John Doe', nss: '123456789', statut: 'non' },
    { name: 'Jane Smith', nss: '987654321', statut: 'oui' },
    { name: 'Pierre Dupont', nss: '111222333', statut: 'non' },
  ];

  toggleStatut(patient: any) {
    patient.statut = patient.statut === 'non' ? 'oui' : 'non';
  }

  effacer(patient: any) {
    this.patients = this.patients.filter(p => p !== patient);
  }
}

