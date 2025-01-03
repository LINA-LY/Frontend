import { Component } from '@angular/core';
import { CommonModule } from '@angular/common'; // Importez CommonModule
import { FormsModule } from '@angular/forms'; // Importez FormsModule
import { AuthService } from '../services/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  standalone: true, // Déclarez ce composant comme standalone
  imports: [CommonModule, FormsModule], // Importez les modules nécessaires ici
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

    console.log('Tentative de connexion avec :', { email: this.email, password: this.password }); // Log des données du formulaire

    this.errorMessage = ''; // Réinitialiser le message d'erreur

    // Validation des champs
    if (!this.email || !this.password) {
      this.errorMessage = 'Veuillez remplir tous les champs.';
      return;
    }

    // Appel du service de connexion
    this.authService.login(this.email, this.password).subscribe({
      next: (response) => {
        console.log('Réponse du backend:', response); // Log la réponse du backend

        if (response.token) {
          // Stocker le token et le rôle dans le localStorage
          localStorage.setItem('auth_token', response.token);
          localStorage.setItem('userData', JSON.stringify(response.user));
          localStorage.setItem('role', response.role);

          console.log('Connexion réussie. Redirection en fonction du rôle...'); // Log de la redirection

          // Rediriger en fonction du rôle
          this.redirectBasedOnRole(response.role);
        } else {
          this.errorMessage = 'Réponse inattendue du serveur.';
        }
      },
      error: (err) => {
        console.error('Erreur de connexion:', err); // Log l'erreur

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
        this.router.navigate(['/dashboard-patient']);
        break;
      case 'Radiologue':
        this.router.navigate(['/dashboard-radiologue']);
        break;
      case 'Infirmier':
        this.router.navigate(['/dashboard-infirmier']);
        break;
      case 'Laborantin':
        this.router.navigate(['/dashboard-laborantin']);
        break;
      default:
        this.router.navigate(['/']); // Redirection par défaut
    }
  }
}