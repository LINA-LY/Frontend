import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root', // Le service est disponible dans toute l'application
})
export class BilanMService {
  private apiUrl = 'http://127.0.0.1:8000/api/bilan'; // URL de l'API backend pour les bilans

  constructor(private http: HttpClient) {}

  // Méthode pour rédiger un bilan
  redigerBilan(bilan: any, nss: string): Observable<any> {
    const headers = new HttpHeaders({
      Authorization: `Bearer ${localStorage.getItem('auth_token')}`, // Ajouter le token d'authentification
    });

    // Ajouter le NSS au corps de la requête
    const data = { ...bilan, nss };

    return this.http.post(this.apiUrl, data, { headers });
  }
}