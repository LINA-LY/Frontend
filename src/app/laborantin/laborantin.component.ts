import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'app-laborantin',
  templateUrl: './laborantin.component.html',
  styleUrls: ['./laborantin.component.scss'],
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule]
})
export class LaborantinComponent implements OnInit {
  currentDate: string = new Date().toLocaleDateString('fr-CA'); // Format YYYY-MM-DD
  laborantinForm: FormGroup;

  constructor(private fb: FormBuilder) {
    this.laborantinForm = this.fb.group({
      glycemie: [null, [Validators.required, Validators.min(0)]],
      pression: [null, [Validators.required, Validators.min(0)]],
      cholesterol: [null, [Validators.required, Validators.min(0)]]
    });
  }

  ngOnInit(): void {}

  onSubmit(): void {
    if (this.laborantinForm.valid) {
      console.log('Bilan enregistré :', this.laborantinForm.value);
      alert('Bilan enregistré avec succès !');
      this.laborantinForm.reset(); // Réinitialiser après soumission
    } else {
      alert('Veuillez remplir tous les champs obligatoires.');
    }
  }

  generateGraph(): void {
    console.log('Génération du graphique de tendance pour les données :', this.laborantinForm.value);
    alert('Graphique de tendance généré.');
  }

  cancel(): void {
    if (confirm('Voulez-vous annuler la saisie du bilan ? Toutes les données seront perdues.')) {
      this.laborantinForm.reset();
    }
  }
}
