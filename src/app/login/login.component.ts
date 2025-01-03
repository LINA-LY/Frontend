import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../services/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
})
export class LoginComponent {
  email: string = '';
  password: string = '';
  errorMessage: string = '';

  constructor(private authService: AuthService, private router: Router) {}

  onSubmit(event: Event) {
    event.preventDefault(); // Empêche le comportement par défaut du formulaire

    console.log('Tentative de connexion avec :', { email: this.email, password: this.password });

    this.errorMessage = ''; // Réinitialiser le message d'erreur

    // Validation des champs
    if (!this.email || !this.password) {
      this.errorMessage = 'Veuillez remplir tous les champs.';
      return;
    }

    // Appel du service de connexion
    this.authService.login(this.email, this.password).subscribe({
      next: (response) => {
        console.log('Réponse du backend:', response);

        if (response.token) {
          // Rediriger en fonction du rôle
          this.redirectBasedOnRole(response.role);
        } else {
          this.errorMessage = 'Réponse inattendue du serveur.';
        }
      },
      error: (err) => {
        console.error('Erreur de connexion:', err);

        // Gestion des erreurs en fonction du type d'erreur
        if (err.status === 401) {
          this.errorMessage = 'Identifiants incorrects.';
        } else if (err.status === 500) {
          this.errorMessage = 'Erreur interne du serveur. Veuillez réessayer plus tard.';
        } else {
          this.errorMessage = 'Une erreur est survenue. Veuillez réessayer.';
        }
      },
    });
  }

  /**
   * Redirige l'utilisateur en fonction de son rôle.
   * @param role Le rôle de l'utilisateur.
   */
  private redirectBasedOnRole(role: string): void {
    switch (role) {
      case 'Medecin':
        this.router.navigate(['/medecin-interface-start']);
        break;
      case 'Patient':
        this.router.navigate(['/patient']);
        break;
      case 'Radiologue':
        this.router.navigate(['/radiologue']);
        break;
      case 'Infirmier':
        this.router.navigate(['/infirmier']);
        break;
      case 'Laborantin':
        this.router.navigate(['/laborantin']);
        break;
      default:
        this.router.navigate(['/']); // Redirection par défaut
    }
  }
}