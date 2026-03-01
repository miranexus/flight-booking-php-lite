import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { PrimeNgData } from '../models';

// Use the live API base URL from window.__API_BASE_URL__
const apiBaseUrl = (window as any).__API_BASE_URL__ || 'https://miranexus.com/api/flight-booking-php-lite/index.php';
const baseUrl = `${apiBaseUrl}?path=/prime-ng-data`;

@Injectable({
  providedIn: 'root',
})
export class PrimeNgDataService {
  constructor(private http: HttpClient) {}

  getAll(): Observable<PrimeNgData[]> {
    return this.http.get<PrimeNgData[]>(baseUrl);
  }

  get(id: any): Observable<PrimeNgData> {
    // Validate id is a number
    if (!/^[0-9]+$/.test(String(id))) throw new Error('Invalid ID');
    return this.http.get<PrimeNgData>(`${baseUrl}/${id}`);
  }

  create(data: any): Observable<any> {
    // Sanitize input data
    const sanitized = this.sanitizeData(data);
    return this.http.post(baseUrl, sanitized);
  }

  update(id: any, data: any): Observable<any> {
    if (!/^[0-9]+$/.test(String(id))) throw new Error('Invalid ID');
    const sanitized = this.sanitizeData(data);
    return this.http.put(`${baseUrl}/${id}`, sanitized);
  }

  delete(id: any): Observable<any> {
    if (!/^[0-9]+$/.test(String(id))) throw new Error('Invalid ID');
    return this.http.delete(`${baseUrl}/${id}`);
  }

  deleteAll(): Observable<any> {
    return this.http.delete(baseUrl);
  }

  findByTitle(title: any): Observable<PrimeNgData[]> {
    // Sanitize title for query param
    const params = new HttpParams().set('title', encodeURIComponent(String(title).replace(/[^\w\s-]/g, '')));
    return this.http.get<PrimeNgData[]>(baseUrl, { params });
  }

  private sanitizeData(data: any): any {
    // Only allow expected fields and basic sanitization
    return {
      title: typeof data.title === 'string' ? data.title.replace(/<[^>]*>?/gm, '').trim() : '',
      description: typeof data.description === 'string' ? data.description.replace(/<[^>]*>?/gm, '').trim() : '',
      published: !!data.published
    };
  }
}
