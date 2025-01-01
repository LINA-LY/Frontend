import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { DpiService } from '../services/dpi.service'; // Assure-toi que le service est importé
import { ToastrService } from 'ngx-toastr';  // Optionnel, pour afficher des messages de succès ou erreur

@Component({
  selector: 'app-create-dpi',
  templateUrl: './create-dpi.component.html',
  styleUrls: ['./creation-dpi.component.css']
})
export class CreateDpiComponent {
  
  dpiData = {
    numSecu: '',
    nom: '',
    prenom: '',
    dateNaissance: '',
    adresse: '',
    telephone: '',
    mutuelle: '',
    medecin: '',
    urgence: ''
  };

  constructor(private dpiService: DpiService, private router: Router, private toastr: ToastrService) {}

  // Fonction pour soumettre le formulaire
  onSubmit(): void {
    this.dpiService.createDpi(this.dpiData).subscribe({
      next: (response) => {
        // Vérifie si le NSS est dans la réponse
        const nss = response.patient?.nss;
        if (nss) {
          this.router.navigate(['/dossier-patient', 'search-dpi'], { queryParams: { nss } });
          this.toastr.success('DPI créé avec succès !');
        } else {
          this.toastr.error('Erreur lors de la création du DPI, NSS manquant.');
        }
      },
      error: (err) => {
        console.error(err);
        this.toastr.error('Erreur lors de la création du DPI.');
      }
    });
  }

  // Fonction pour annuler la création du DPI et rediriger
  onCancel(): void {
    this.router.navigate(['/dossier-patient']);
  }
}
