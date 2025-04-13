import { Injectable, inject, signal } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiService } from './api.service';
import { Company } from '../models/company.model';

@Injectable()
export class CompanyService {
  private readonly apiService = inject(ApiService);

  public searchCompanies(name: string): Observable<Company[]> {
    return this.apiService.get<Company[]>(`/companies?name=${encodeURIComponent(name)}`);
  }
} 