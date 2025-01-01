import { Component } from '@angular/core';
import { AuthService } from '../services/auth.service';  // Assure-toi que le chemin est correct
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {
  email: string = '';
  password: string = '';
  errorMessage: string = '';

  constructor(private authService: AuthService, private router: Router) {}

    // Gestion du changement de l'email
    onEmailChange(event: Event): void {
      this.email = (event.target as HTMLInputElement).value;
    }
  
    // Gestion du changement du mot de passe
    onPasswordChange(event: Event): void {
      this.password = (event.target as HTMLInputElement).value;
    }



  onSubmit() {
    if (!this.email || !this.password) {
      this.errorMessage = 'Veuillez remplir tous les champs.';
      return;
    }

    this.authService.login(this.email, this.password).subscribe({
      next: (response) => {
        // Si la connexion réussie, redirige l'utilisateur vers le dashboard
        if (response.token) {
          // Stockage des données dans le localStorage ou sessionStorage si nécessaire
          localStorage.setItem('auth_token', response.token);
          localStorage.setItem('role', response.role);


            // Message de bienvenue
            console.log(`Bienvenue, ${response.role}!`);

          // Redirection en fonction du rôle
          switch (response.role) {
            case 'Medecin':
              this.router.navigate(['/dashboard-medecin']);
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
              this.router.navigate(['/']);
          }
        }
      },
      error: (err) => {
        // Gérer l'erreur en cas d'échec de la connexion
        this.errorMessage = 'Nom d\'utilisateur ou mot de passe incorrect!';
      }
    });
  }
}
