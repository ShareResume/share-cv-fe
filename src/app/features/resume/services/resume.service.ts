import { Injectable, inject } from '@angular/core';
import { Observable, map } from 'rxjs';
import { ApiService } from '@app/core/services/api.service';
import { Resume, ResumeData } from '../models/resume.model';
import { GetResumeParamsModel } from '../models/get-resume-params.model';
import { HttpClient } from '@angular/common/http';
import { environment } from '@environments/environment';
import { ResumeFilters } from '../models/resume-filters.model';
import { ResumeResponse } from '../models/resume-response.model';

@Injectable({
  providedIn: 'root',
})
export class ResumeService {
  private apiService = inject(ApiService);
  private httpClient = inject(HttpClient);
  private readonly apiEndpoint = '/resumes';
  private readonly baseUrl = environment.apiBaseUrl;

  /**
   * Default pagination settings
   */
  private readonly DEFAULT_PAGE_SIZE = 10;
  private readonly DEFAULT_PAGE_NUMBER = 1;
  private readonly DEFAULT_ORDER_BY = 'Date';
  private readonly DEFAULT_SORT_ORDER = 'Descending';

  /**
   * Get resumes with optional filters
   */
  getResumes(filters?: ResumeFilters): Observable<ResumeResponse> {
    const queryParams = this.transformFiltersToQueryParams(filters);
    const validParams = this.validateParams(queryParams);
    const queryString = this.apiService.generateQueryParams(validParams);
    
    return this.httpClient.get<ResumeData[]>(
      `${this.baseUrl}${this.apiEndpoint}?${queryString}`,
      { observe: 'response' },
    ).pipe(
      map(response => {
        let totalCount = response.body?.length || 0;
        
        // Try to get the total count from the X-Total-Count header
        const totalCountHeader = response.headers.get('X-Total-Count');

        if (totalCountHeader) {
          const count = parseInt(totalCountHeader, 10);

          if (!isNaN(count)) {
            totalCount = count;
          }
        }
        
        // Transform the data
        const data = response.body ? Resume.fromJsonArray(response.body) : [];
        
        return {
          data,
          totalCount,
        };
      }),
    );
  }
  
  /**
   * Validates and normalizes the params to ensure they meet expected formats
   */
  private validateParams(params: GetResumeParamsModel): GetResumeParamsModel {
    return {
      pageSize: params.pageSize && !isNaN(Number(params.pageSize))
        ? Number(params.pageSize)
        : this.DEFAULT_PAGE_SIZE,
      page: params.page && !isNaN(Number(params.page))
        ? Number(params.page)
        : this.DEFAULT_PAGE_NUMBER,
      orderBy: this.isValidOrderBy(params.orderBy)
        ? params.orderBy
        : this.DEFAULT_ORDER_BY,
      sortOrder: this.isValidSortOrder(params.sortOrder)
        ? params.sortOrder
        : this.DEFAULT_SORT_ORDER,
      company: params.company || undefined,
      specialization: params.specialization || undefined,
      status: params.status || undefined,
      minYoe: params.minYoe !== undefined && !isNaN(Number(params.minYoe))
        ? Number(params.minYoe)
        : undefined,
      maxYoe: params.maxYoe !== undefined && !isNaN(Number(params.maxYoe))
        ? Number(params.maxYoe)
        : undefined,
      date: params.date || undefined,
    };
  }
  
  /**
   * Check if orderBy value is valid
   */
  private isValidOrderBy(orderBy?: string): orderBy is 'Date' | 'Company' | 'Status' {
    return !!orderBy && ['Date', 'Company', 'Status'].includes(orderBy);
  }
  
  /**
   * Check if sortOrder value is valid
   */
  private isValidSortOrder(sortOrder?: string): sortOrder is 'Ascending' | 'Descending' {
    return !!sortOrder && ['Ascending', 'Descending'].includes(sortOrder);
  }
  
  /**
   * Transforms the filters object into a flat query params object
   */
  private transformFiltersToQueryParams(filters?: ResumeFilters): GetResumeParamsModel {
    if (!filters) {
return {};
}
    
    const { yearsOfExperience, ...basicFilters } = filters;
    
    const queryParams: GetResumeParamsModel = Object.entries(basicFilters)
      .reduce((params, [key, value]) => {
        if (value !== undefined && value !== null && value !== '') {
          params[key as keyof GetResumeParamsModel] = value;
        }

        return params;
      }, {} as GetResumeParamsModel);
    
    // Add min/max years of experience if they exist
    if (yearsOfExperience?.min !== undefined && yearsOfExperience.min !== null) {
      queryParams.minYoe = yearsOfExperience.min;
    }
    
    if (yearsOfExperience?.max !== undefined && yearsOfExperience.max !== null) {
      queryParams.maxYoe = yearsOfExperience.max;
    }
    
    return queryParams;
  }
} 