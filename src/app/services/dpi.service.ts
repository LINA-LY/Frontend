import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { AuthService } from './auth.service'; // Importez AuthService

@Injectable({
  providedIn: 'root',
})
export class DpiService {
  private apiUrl = 'http://127.0.0.1:8000/dossier_patient/api/dossier-medical/'; // URL de votre API Django

  constructor(private http: HttpClient, private authService: AuthService) {}

  // Méthode pour créer un DPI
  createDpi(dpiData: any): Observable<any> {
  
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${localStorage.getItem('auth_token')}`
    });

    return this.http.post(`${this.apiUrl}`, dpiData, { headers });
  }

  // Méthode pour rechercher un DPI par NSS
  searchDpi(nss: string): Observable<any> {
   
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${localStorage.getItem('auth_token')}`
    });

    return this.http.get(`${this.apiUrl}${nss}/lister_dossier_complet/`, { headers });
  }
}