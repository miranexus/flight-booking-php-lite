import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { PrimeNgData } from '../models';

const apiBaseUrl = (window as any).__API_BASE_URL__ || 'http://localhost:8080/api';
const baseUrl = `${apiBaseUrl.replace(/\/$/, '')}/prime-ng-data`;

@Injectable({
  providedIn: 'root',
})
export class PrimeNgDataService {
  constructor(private http: HttpClient) {}

  getAll(): Observable<PrimeNgData[]> {
    return this.http.get<PrimeNgData[]>(baseUrl);
  }

  get(id: any): Observable<PrimeNgData> {
    return this.http.get<PrimeNgData>(`${baseUrl}/${id}`);
  }

  create(data: any): Observable<any> {
    return this.http.post(baseUrl, data);
  }

  update(id: any, data: any): Observable<any> {
    return this.http.put(`${baseUrl}/${id}`, data);
  }

  delete(id: any): Observable<any> {
    return this.http.delete(`${baseUrl}/${id}`);
  }

  deleteAll(): Observable<any> {
    return this.http.delete(baseUrl);
  }

  findByTitle(title: any): Observable<PrimeNgData[]> {
    return this.http.get<PrimeNgData[]>(`${baseUrl}?title=${title}`);
  }
}
