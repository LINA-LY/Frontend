import { Injectable, Inject, PLATFORM_ID } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { catchError, tap, throwError, Observable, BehaviorSubject } from 'rxjs';
import { isPlatformBrowser } from '@angular/common';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private apiUrl = 'http://127.0.0.1:8000/api/login/';
  private nssSubject = new BehaviorSubject<string | null>(null); // Define nssSubject
  public nss$ = this.nssSubject.asObservable()
  constructor(
    private http: HttpClient,
    @Inject(PLATFORM_ID) private platformId: Object
  ) {}

  login(email: string, password: string): Observable<any> {
    const data = { email, password };
    return this.http.post<any>(this.apiUrl, data).pipe(
      tap((response) => {
        if (isPlatformBrowser(this.platformId)) {
          if (response.token) {
            // Store the token in localStorage
            localStorage.setItem('authToken', response.token);
  
            // Store the user data in localStorage
            const userData = {
              id: response.id,
              nom: response.nom,
              prenom: response.prenom,
              email: response.email,
            };
            localStorage.setItem('userData', JSON.stringify(userData));
  
            // Store the role if available
            if (response.role) {
              localStorage.setItem('role', response.role);
            }
          }
        }
      }),
      catchError(this.handleError)
    );
  }
  setNss(nss: string) {
    this.nssSubject.next(nss);
  }

  getNss(): string | null {
    return this.nssSubject.value;
  }
  private handleError(error: HttpErrorResponse): Observable<never> {
    let errorMessage = 'Une erreur est survenue, réessayez plus tard.';
    if (error.error instanceof ErrorEvent) {
      errorMessage = `Erreur côté client : ${error.error.message}`;
    } else {
      if (error.status === 401) {
        this.logout();
        errorMessage = 'Identifiants incorrects.';
      } else if (error.status === 500) {
        errorMessage = 'Erreur interne du serveur. Veuillez réessayer plus tard.';
      } else {
        errorMessage = `Erreur côté serveur : ${error.status} - ${error.error}`;
      }
    }
    console.error(errorMessage);
    return throwError(() => new Error(errorMessage));
  }

  isLoggedIn(): boolean {
    if (isPlatformBrowser(this.platformId)) {
      return !!localStorage.getItem('authToken');
    }
    return false;
  }
  logout(): void {
    if (isPlatformBrowser(this.platformId)) { // Check if running in the browser
      localStorage.removeItem('authToken');
      localStorage.removeItem('userData');
      localStorage.removeItem('role');
      this.nssSubject.next(null);
    }
  }

  getRole(): string | null {
    if (isPlatformBrowser(this.platformId)) {
      return localStorage.getItem('role');
    }
    return null;
  }
}