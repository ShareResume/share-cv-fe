import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable, map } from 'rxjs';
import { environment } from '@environments/environment';
import { CompanyStat } from '../../../core/models/company-stat.model';

@Injectable({
  providedIn: 'root'
})
export class HomeService {
  private readonly http = inject(HttpClient);
  private readonly apiUrl = environment.apiBaseUrl;

  /**
   * Fetches company statistics data from the API
   * @returns Observable with array of CompanyStat objects
   */
  getStatistics(): Observable<CompanyStat[]> {
    const url = `${this.apiUrl}/statistics`;
    
    return this.http.get<any[]>(url).pipe(
      map(data => data.map(item => CompanyStat.fromJson(item)))
    );
  }
} 