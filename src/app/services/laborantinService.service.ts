import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class LaborantinService {
  private apiUrl = 'http://127.0.0.1:8000/api/bilan'; // Remplacez par l'URL de votre API

  constructor(private http: HttpClient) {}

  // Méthode pour envoyer les données du bilan
  saveBilan(bilanData: any): Observable<any> {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${localStorage.getItem('auth_token')}`
    });

    return this.http.post(this.apiUrl, bilanData, { headers });
  }
}