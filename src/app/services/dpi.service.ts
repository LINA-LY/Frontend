import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';


@Injectable({
  providedIn: 'root'
})
export class DpiService {

  private apiUrl = `${environment.apiBaseUrl}/create-dpi`;  // Modifie avec l'URL appropriée

  constructor(private http: HttpClient) {}

  // Fonction pour créer un DPI
  createDpi(data: any): Observable<any> {
    const token = localStorage.getItem('auth_token'); // Récupère le token depuis le localStorage
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);

    return this.http.post(this.apiUrl, data, { headers });
  }
}
