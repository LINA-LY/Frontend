import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class BilanService {
  private apiUrl = 'http://127.0.0.1:8000/api/resume'; // URL de l'API backend

  constructor(private http: HttpClient) {}

  // Méthode pour enregistrer le bilan
  enregistrerBilan(bilan: any): Observable<any> {
    const headers = new HttpHeaders({
      Authorization: `Bearer ${localStorage.getItem('auth_token')}`, // Ajouter le token d'authentification
    });
    return this.http.post(this.apiUrl, bilan, { headers });
  }
}