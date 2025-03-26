import {
  inject,
  Injectable,
  makeStateKey,
  PLATFORM_ID,
  StateKey,
  TransferState,
} from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { API_BASE_KEY } from '../constants/api.constants';
import { AuthResponse } from '../models/user.model';
import { QueryParamsModel } from '../models/query-params-model';
import { TOKEN_KEY } from '../constants/user.constants';

@Injectable({
  providedIn: 'root',
})
export class ApiService {
  private readonly httpClient: HttpClient = inject(HttpClient);
  private readonly transferState: TransferState = inject(TransferState);
  private readonly stateKey: StateKey<string>
    = makeStateKey<string>(API_BASE_KEY);
  private baseUrl: string | null = this.transferState.get(this.stateKey, '');
  private readonly platformId = inject(PLATFORM_ID);

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
      .filter(([_, value]) => typeof value !== 'undefined' && value !== null)
      .map(([key, value]) => (params = params.set(key, value!)));

    return params.toString();
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
