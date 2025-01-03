import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root', // Le service est disponible dans toute l'application
})
export class OrdonnanceService {
  private apiUrl = 'http://127.0.0.1:8000/api/ordonnance'; // URL de l'API backend pour les ordonnances

  constructor(private http: HttpClient) {}

  // Méthode pour enregistrer une ordonnance
  enregistrerOrdonnance(ordonnance: any): Observable<any> {
    const headers = new HttpHeaders({
      Authorization: `Bearer ${localStorage.getItem('auth_token')}`, // Ajouter le token d'authentification
    });
    return this.http.post(this.apiUrl, ordonnance, { headers });
  }
}