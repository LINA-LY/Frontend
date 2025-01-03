import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';

@Injectable({
  providedIn: 'root',
})
export class AuthGuard implements CanActivate {
  constructor(private authService: AuthService, private router: Router) {}

  canActivate(): boolean {
    if (this.authService.isLoggedIn()) {
      return true; // Autorisez l'accès
    } else {
      this.router.navigate(['/login'], {
        queryParams: { returnUrl: this.router.url }, // Passez l'URL cible
      });
      return false; // Bloquez l'accès
    }
  }
}