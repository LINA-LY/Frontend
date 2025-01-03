import { Component } from '@angular/core';

@Component({
  selector: 'app-compterendu',
  templateUrl: './compterendu.component.html',
  styleUrls: ['./compterendu.component.scss']
})
export class CompterenduComponent {

  todayDate: string = new Date().toLocaleDateString('fr-FR');

  // Pour le bouton "Joindre Radio"
  onAttachRadio(): void {
    const options = `
      Choisissez une option:
      1. Prendre une photo
      2. Parcourir les fichiers
    `;
    const choice = prompt(options);
    if (choice === '1') {
      this.capturePhoto();
    } else if (choice === '2') {
      this.selectFile();
    } else {
      alert('Option invalide');
    }
  }

  capturePhoto(): void {
    alert('Fonctionnalité de capture photo à implémenter.');
  }

  selectFile(): void {
    alert('Fenêtre pour parcourir les fichiers à implémenter.');
  }

  saveReport(): void {
    alert('Compte-Rendu enregistré avec succès!');
  }

  cancel(): void {
    alert('Action annulée.');
  }
}

