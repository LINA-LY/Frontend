import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { catchError, throwError } from 'rxjs';
import { Router } from '@angular/router';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const router = inject(Router);
  const authToken = localStorage.getItem('auth_token'); // Récupérez le token du localStorage

  // Clonez la requête et ajoutez l'en-tête Authorization si un token existe
  if (authToken) {
    req = req.clone({
      setHeaders: {
        Authorization: `Bearer ${authToken}`,
      },
    });
  }

  // Passez la requête modifiée au gestionnaire suivant
  return next(req).pipe(
    catchError((error) => {
      // Gestion des erreurs
      if (error.status === 401) {
        // Si l'erreur est 401 (Non autorisé), redirigez vers la page de connexion
        router.navigate(['/login']);
      }

      // Renvoyez l'erreur pour qu'elle soit traitée par le composant
      return throwError(() => error);
    })
  );
};