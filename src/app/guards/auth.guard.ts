import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { AuthService } from '../services/auth.service'; // Importez votre AuthService

@Injectable({
  providedIn: 'root',
})
export class AuthGuard implements CanActivate {
  constructor(private authService: AuthService, private router: Router) {}

  canActivate(): boolean {
    if (this.authService.isLoggedIn()) {
      return true; // L'utilisateur est connecté, autorisez l'accès
    } else {
      this.router.navigate(['/login']); // Redirigez vers la page de connexion
      return false; // Bloquez l'accès
    }
  }
}