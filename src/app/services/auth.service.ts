import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { catchError, throwError } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private apiUrl = 'http://127.0.0.1:8000/api/login/'; // URL vers l'API backend

  constructor(private http: HttpClient) {}

  login(email: string, password: string) {
    const data = { email, password }; // Données à envoyer au backend

    return this.http.post<any>(this.apiUrl, data).pipe(
      catchError(this.handleError) // Gestion des erreurs
    );
  }

  // Gestion des erreurs HTTP
  private handleError(error: HttpErrorResponse) {
    if (error.error instanceof ErrorEvent) {
      // Erreur côté client
      console.error('Une erreur est survenue:', error.error.message);
    } else {
      // Erreur côté serveur
      console.error(
        `Le serveur a retourné le code ${error.status}, ` +
        `le corps de la réponse était: ${error.error}`
      );
      // Personnaliser le message d'erreur en fonction du code d'erreur
      if (error.status === 401) {
        return throwError(() => new Error('Identifiants incorrects.'));
      } else if (error.status === 500) {
        return throwError(() => new Error('Erreur interne du serveur.'));
      }
    }
    return throwError(() => new Error('Une erreur est survenue, réessayez plus tard.'));
  }
}
  