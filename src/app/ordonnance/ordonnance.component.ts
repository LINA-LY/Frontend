import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators, AbstractControl, ValidatorFn, ReactiveFormsModule } from '@angular/forms';
import { OrdonnanceService } from '../services/ordonnance.service';
import { CommonModule } from '@angular/common';

// Fonction de validation personnalisée pour le NSS
export function nssValidator(): ValidatorFn {
  return (control: AbstractControl): { [key: string]: any } | null => {
    const value = control.value;
    const regex = /^[a-zA-Z0-9]+$/; // Regex pour accepter uniquement des chiffres ou des lettres
    const isValid = regex.test(value);
    return isValid ? null : { invalidNss: { value: control.value } };
  };
}

interface MedicamentDetails {
  nom: string;
  dosage: string;
  forme: string;
}

interface Medicament {
  quantite: string;
  description: string;
  duree: string;
  medicament: MedicamentDetails;
}

interface Ordonnance {
  date: string;
  nom_patient: string;
  prenom_patient: string;
  nss: string;
  medicaments: Medicament[];
}

@Component({
  selector: 'app-ordonnance',
  templateUrl: './ordonnance.component.html',
  styleUrls: ['./ordonnance.component.scss'],
  imports: [CommonModule, ReactiveFormsModule],

})
export class OrdonnanceComponent {
  ordonnanceForm: FormGroup;
  medicaments: Medicament[] = [];
  messageSucces: string | null = null;
  messageErreur: string | null = null;

  constructor(
    private fb: FormBuilder,
    private ordonnanceService: OrdonnanceService
  ) {
    this.ordonnanceForm = this.fb.group({
      date: ['', Validators.required],
      nom_patient: ['', Validators.required],
      prenom_patient: ['', Validators.required],
      nss: ['', [Validators.required, nssValidator()]], // Validation personnalisée
      nouveauMedicament: this.fb.group({
        quantite: ['', Validators.required],
        description: ['', Validators.required],
        duree: ['', Validators.required],
        medicament: this.fb.group({
          nom: ['', Validators.required],
          dosage: ['', Validators.required],
          forme: ['', Validators.required],
        }),
      }),
    });
  }

  // Ajouter un médicament à la liste
  ajouterMedicament() {
    if (this.ordonnanceForm.get('nouveauMedicament')?.valid) {
      const medicament = this.ordonnanceForm.get('nouveauMedicament')?.value;
      this.medicaments.push(medicament);
      this.ordonnanceForm.get('nouveauMedicament')?.reset();
      this.messageErreur = null; // Réinitialiser les messages d'erreur
    } else {
      this.messageErreur = 'Veuillez remplir tous les champs du médicament.';
    }
  }

  // Supprimer un médicament de la liste
  supprimerMedicament(index: number) {
    this.medicaments.splice(index, 1);
  }

  // Enregistrer l'ordonnance
  enregistrerOrdonnance() {
    if (this.ordonnanceForm.valid) {
      const ordonnance: Ordonnance = {
        date: this.ordonnanceForm.get('date')?.value,
        nom_patient: this.ordonnanceForm.get('nom_patient')?.value,
        prenom_patient: this.ordonnanceForm.get('prenom_patient')?.value,
        nss: this.ordonnanceForm.get('nss')?.value,
        medicaments: this.medicaments,
      };

      this.ordonnanceService.enregistrerOrdonnance(ordonnance).subscribe(
        (response) => {
          this.messageSucces = 'Ordonnance enregistrée avec succès !';
          this.messageErreur = null;
          this.annuler();
        },
        (error) => {
          this.messageErreur =
            "Une erreur est survenue lors de l'enregistrement de l'ordonnance.";
          console.error('Erreur API :', error);
        }
      );
    } else {
      this.messageErreur =
        'Veuillez remplir tous les champs correctement.';
    }
  }

  // Réinitialiser le formulaire
  annuler() {
    this.ordonnanceForm.reset();
    this.medicaments = [];
    this.messageSucces = null;
    this.messageErreur = null;
  }
}