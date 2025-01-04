import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-compterendu',
  templateUrl: './compterendu.component.html',
  styleUrls: ['./compterendu.component.css'],
  standalone: true,
  imports: [CommonModule, FormsModule], // Import CommonModule and FormsModule
})
export class CompterenduComponent {
  todayDate: string = new Date().toLocaleDateString('fr-FR');
  nomPatient: string = ''; // Champ pour le nom du patient
  radiologue: string = ''; // Champ pour le nom du radiologue
  compteRendu: string = ''; // Pour stocker le texte du compte-rendu
  radioImages: File[] = []; // Pour stocker les images de la radio
  radioImageUrls: string[] = []; // Pour afficher les images dans l'UI

  // Pour le bouton "Joindre Radio"
  onAttachRadio(): void {
    const fileInput = document.createElement('input');
    fileInput.type = 'file';
    fileInput.accept = 'image/*'; // Accepter uniquement les images
    fileInput.multiple = true; // Permettre la sélection de plusieurs fichiers
    fileInput.onchange = (event: Event) => {
      const target = event.target as HTMLInputElement;
      if (target.files && target.files.length > 0) {
        for (let i = 0; i < target.files.length; i++) {
          const file = target.files[i];
          this.radioImages.push(file); // Ajouter le fichier à la liste
          this.radioImageUrls.push(URL.createObjectURL(file)); // Générer une URL pour l'image
        }
        alert(`${target.files.length} fichier(s) sélectionné(s).`);
      }
    };
    fileInput.click(); // Ouvrir la boîte de dialogue de sélection de fichier
  }

  saveReport(): void {
    // Vérifier si tous les champs obligatoires sont remplis
    if (!this.nomPatient || !this.radiologue || !this.compteRendu || this.radioImages.length === 0) {
      alert('Veuillez remplir tous les champs obligatoires et joindre au moins une image.');
      return;
    }

    // Simuler l'enregistrement du compte-rendu
    console.log('Nom du patient :', this.nomPatient);
    console.log('Radiologue :', this.radiologue);
    console.log('Compte-Rendu :', this.compteRendu);
    console.log('Radio Images :', this.radioImages);
    alert('Compte-Rendu enregistré avec succès!');

    // Réinitialiser le formulaire après enregistrement
    this.nomPatient = '';
    this.radiologue = '';
    this.compteRendu = '';
    this.radioImages = [];
    this.radioImageUrls = [];
  }

  cancel(): void {
    this.nomPatient = '';
    this.radiologue = '';
    this.compteRendu = '';
    this.radioImages = [];
    this.radioImageUrls = [];
    alert('Action annulée.');
  }

  // Supprimer une image de la liste
  removeImage(index: number): void {
    this.radioImages.splice(index, 1); // Supprimer l'image de la liste
    this.radioImageUrls.splice(index, 1); // Supprimer l'URL de l'image
  }
}