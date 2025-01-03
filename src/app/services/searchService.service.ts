import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class SearchService {
  private apiBaseUrl = 'http://127.0.0.1:8000/dossier_patient/api/dossier-medical/';

  constructor(private http: HttpClient) { }

  searchDpi(nss: string): Observable<any> {
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${localStorage.getItem('auth_token')}`
    });

    return this.http.get(`${this.apiBaseUrl}${nss}/lister_dossier_complet/`, { headers });
  }
}