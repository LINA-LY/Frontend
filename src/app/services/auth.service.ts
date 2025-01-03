import { Injectable, Inject, PLATFORM_ID } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { catchError, throwError, Observable } from 'rxjs';
import { isPlatformBrowser } from '@angular/common'; // Importez isPlatformBrowser

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private apiUrl = 'http://127.0.0.1:8000/api/login/'; // URL de votre backend

  constructor(
    private http: HttpClient,
    @Inject(PLATFORM_ID) private platformId: Object // Injectez PLATFORM_ID
  ) {}

  login(email: string, password: string): Observable<any> {
    const data = { email, password }; // Données à envoyer
    return this.http.post<any>(this.apiUrl, data).pipe(
      catchError(this.handleError) // Gestion des erreurs
    );
  }

  private handleError(error: HttpErrorResponse): Observable<never> {
    let errorMessage = 'Une erreur est survenue, réessayez plus tard.';
    if (error.error instanceof ErrorEvent) {
      errorMessage = `Erreur côté client : ${error.error.message}`;
    } else {
      errorMessage = `Erreur côté serveur : ${error.status} - ${error.error}`;
    }
    console.error(errorMessage);
    return throwError(() => new Error(errorMessage));
  }

  isLoggedIn(): boolean {
    // Vérifiez si vous êtes dans un environnement de navigateur
    if (isPlatformBrowser(this.platformId)) {
      return !!localStorage.getItem('authToken');
    }
    return false; // Si ce n'est pas un navigateur, retournez false
  }

  logout(): void {
    // Vérifiez si vous êtes dans un environnement de navigateur
    if (isPlatformBrowser(this.platformId)) {
      localStorage.removeItem('authToken');
      localStorage.removeItem('userData');
    }
  }
}