import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { Chart, registerables, ChartConfiguration } from 'chart.js';

@Component({
  selector: 'app-laborantin',
  templateUrl: './laborantin.component.html',
  styleUrls: ['./laborantin.component.scss'],
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
})
export class LaborantinComponent implements OnInit {
  currentDate: string = new Date().toLocaleDateString('fr-CA'); // Format YYYY-MM-DD
  laborantinForm: FormGroup;
  chart!: Chart; // Typé explicitement pour Chart.js

  constructor(private fb: FormBuilder) {
    Chart.register(...registerables); // Nécessaire pour utiliser Chart.js
    this.laborantinForm = this.fb.group({
      nomPatient: [null, [Validators.required]], // Champ obligatoire
      laborantin: [null, [Validators.required]], // Champ obligatoire
      glycemie: [null, [Validators.required, Validators.min(0)]],
      pression: [null, [Validators.required, Validators.min(0)]],
      cholesterol: [null, [Validators.required, Validators.min(0)]],
    });
  }

  ngOnInit(): void {}

  onSubmit(): void {
    // Marquer tous les champs comme "touched" pour afficher les erreurs
    this.laborantinForm.markAllAsTouched();

    if (this.laborantinForm.valid) {
      const bilanData = this.laborantinForm.value;

      // Simuler l'enregistrement du bilan
      console.log('Données du bilan :', bilanData);
      alert('Bilan enregistré avec succès !');
      this.laborantinForm.reset(); // Réinitialiser après soumission
    } else {
      alert('Veuillez remplir tous les champs obligatoires.');
    }
  }

  generateGraph(): void {
    if (this.laborantinForm.invalid) {
      alert('Veuillez remplir tous les champs avant de générer le graphique.');
      return;
    }

    const values = this.laborantinForm.value;

    // Supprimer un ancien graphique s'il existe
    if (this.chart) {
      this.chart.destroy();
    }

    // Configuration du graphique avec typage explicite
    const config: ChartConfiguration<'bar'> = {
      type: 'bar', // Type du graphique
      data: {
        labels: ['Glycémie', 'Pression artérielle', 'Cholestérol'],
        datasets: [
          {
            label: 'Valeurs',
            data: [values.glycemie, values.pression, values.cholesterol],
            backgroundColor: 'rgba(79, 195, 247, 0.6)', // Couleur des barres
            borderColor: 'rgba(41, 182, 246, 1)', // Couleur des contours
            borderWidth: 1,
          },
        ],
      },
      options: {
        responsive: true,
        scales: {
          y: {
            beginAtZero: true,
          },
        },
        plugins: {
          legend: {
            display: false, // Masque la légende
          },
          title: {
            display: true,
            text: "Graphique des résultats d'analyse",
          },
        },
      },
    };

    // Initialiser le graphique
    const canvas = document.getElementById('myChart') as HTMLCanvasElement;
    this.chart = new Chart(canvas.getContext('2d')!, config);
  }

  cancel(): void {
    if (
      confirm(
        'Voulez-vous annuler la saisie du bilan ? Toutes les données seront perdues.'
      )
    ) {
      this.laborantinForm.reset();
    }
  }
}