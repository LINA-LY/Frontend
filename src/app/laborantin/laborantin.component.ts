import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { Chart, registerables, ChartConfiguration } from 'chart.js';
import { LaborantinService } from '../services/laborantinService.service';

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

  constructor(private fb: FormBuilder, private laborantinService: LaborantinService) {
    Chart.register(...registerables); // Nécessaire pour utiliser Chart.js
    this.laborantinForm = this.fb.group({
      glycemie: [null, [Validators.required, Validators.min(0)]],
      pression: [null, [Validators.required, Validators.min(0)]],
      cholesterol: [null, [Validators.required, Validators.min(0)]],
    });
  }

  ngOnInit(): void {}

  onSubmit(): void {
    if (this.laborantinForm.valid) {
      const bilanData = this.laborantinForm.value;

      // Appel du service pour enregistrer le bilan
      this.laborantinService.saveBilan(bilanData).subscribe(
        (response) => {
          console.log('Bilan enregistré avec succès :', response);
          alert('Bilan enregistré avec succès !');
          this.laborantinForm.reset(); // Réinitialiser après soumission
        },
        (error) => {
          console.error('Erreur lors de l\'enregistrement du bilan :', error);
          alert('Une erreur s\'est produite lors de l\'enregistrement du bilan.');
        }
      );
    } else {
      alert('Veuillez remplir tous les champs obligatoires.');
    }
  }

  generateGraph(): void {
    const values = this.laborantinForm.value;

    if (!values.glycemie || !values.pression || !values.cholesterol) {
      alert('Veuillez remplir tous les champs avant de générer le graphique.');
      return;
    }

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