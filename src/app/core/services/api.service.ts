import {
  inject,
  Injectable,
  PLATFORM_ID,
} from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { AuthResponse } from '../models/user.model';
import { QueryParamsModel } from '../models/query-params-model';
import { TOKEN_KEY } from '../constants/user.constants';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class ApiService {
  private readonly httpClient: HttpClient = inject(HttpClient);
  private readonly platformId = inject(PLATFORM_ID);
  private readonly baseUrl: string = environment.apiBaseUrl;

  public constructor() {
  }

  public setAccessToken(data: AuthResponse): void {
    localStorage.setItem(TOKEN_KEY, JSON.stringify(data));
  }

  public getAccessToken(): AuthResponse | null {
    const value = localStorage.getItem(TOKEN_KEY);

    if (value) {
      return JSON.parse(value);
    }

    return null;
  }

  generateQueryParams(paramsObj: QueryParamsModel): string {
    let params = new HttpParams();

    Object.entries(paramsObj)
      .filter(([, value]) => typeof value !== 'undefined' && value !== null)
      .map(([key, value]) => (params = params.set(key, value!)));

    return params.toString();
  }
  
  /**
   * Helper method to convert an object to FormData
   * Handles different data types appropriately
   */
  public createFormData<T extends Record<string, any>>(data: T): FormData {
    const formData = new FormData();
    
    Object.entries(data).forEach(([key, value]) => {
      // Skip null or undefined values
      if (value === null || value === undefined) {
        return;
      }
      
      // Handle booleans - convert to string
      if (typeof value === 'boolean') {
        formData.append(key, value.toString());
        return;
      }
      
      // Handle numbers - convert to string
      if (typeof value === 'number') {
        formData.append(key, value.toString());
        return;
      }
      
      // Handle files and blobs directly
      if (value instanceof File || value instanceof Blob) {
        formData.append(key, value);
        return;
      }
      
      // Handle other types (strings, etc.)
      formData.append(key, value);
    });
    
    return formData;
  }
  
  public get<T>(
    route: string,
    options?: { headers?: HttpHeaders | Record<string, string | string[]> },
  ): Observable<T> {
    return this.httpClient.get<T>(`${this.baseUrl}${route}`, options);
  }

  public post<T, R>(
    route: string,
    body: T,
    options?: { headers?: HttpHeaders | Record<string, string | string[]> },
  ): Observable<R> {
    return this.httpClient.post<R>(`${this.baseUrl}${route}`, body, options);
  }

  public put<T, R>(
    route: string,
    body: T,
    options?: { headers?: HttpHeaders | Record<string, string | string[]> },
  ): Observable<R> {
    return this.httpClient.put<R>(`${this.baseUrl}${route}`, body, options);
  }

  public patch<T, R>(
    route: string,
    body: T,
    options?: { headers?: HttpHeaders | Record<string, string | string[]> },
  ): Observable<R> {
    return this.httpClient.patch<R>(`${this.baseUrl}${route}`, body, options);
  }

  public delete<T>(
    route: string,
    options?: { headers?: HttpHeaders | Record<string, string | string[]> },
  ): Observable<T> {
    return this.httpClient.delete<T>(`${this.baseUrl}${route}`, options);
  }
}
