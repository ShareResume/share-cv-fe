import { Injectable, inject } from '@angular/core';
import { Observable, map } from 'rxjs';
import { ApiService } from '@app/core/services/api.service';
import { PublicResume, PublicResumeData } from '../models/resume.model';
import { GetResumeParamsModel } from '../models/get-resume-params.model';
import { HttpClient } from '@angular/common/http';
import { environment } from '@environments/environment';
import { ResumeFilters } from '../models/resume-filters.model';
import { ResumeResponse } from '../models/resume-response.model';

/**
 * Update ResumeResponse to work with PublicResume
 */
interface PublicResumeResponse {
  data: PublicResume[];
  totalCount: number;
}

@Injectable({
  providedIn: 'root',
})
export class ResumeService {
  private apiService = inject(ApiService);
  private httpClient = inject(HttpClient);
  private readonly apiEndpoint = '/public-users-resumes';
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
  getResumes(filters?: ResumeFilters): Observable<PublicResumeResponse> {
    const queryParams = this.transformFiltersToQueryParams(filters);
    const validParams = this.validateParams(queryParams);
    const queryString = this.apiService.generateQueryParams(validParams);
    
    return this.httpClient.get<PublicResumeData[]>(
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
        
        // Transform the data - explicitly use PublicResume.fromJson instead of the generic Resume.fromJson
        const data = response.body 
          ? response.body.map(item => PublicResume.fromJson(item))
          : [];
        
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
      companyId: params.companyId || undefined,
      speciality: params.speciality || undefined,
      isHrScreeningPassed: params.isHrScreeningPassed,
      'yearOfExperienceRange.min': params['yearOfExperienceRange.min'] !== undefined && 
                                  !isNaN(Number(params['yearOfExperienceRange.min']))
        ? Number(params['yearOfExperienceRange.min'])
        : undefined,
      'yearOfExperienceRange.max': params['yearOfExperienceRange.max'] !== undefined && 
                                  !isNaN(Number(params['yearOfExperienceRange.max']))
        ? Number(params['yearOfExperienceRange.max'])
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
    
    const { yearOfExperienceRange, company, companyId, ...basicFilters } = filters;
    
    // Initialize with an empty object of the correct type
    const queryParams = {} as GetResumeParamsModel;
    
    // Add the basic filters
    Object.entries(basicFilters).forEach(([key, value]) => {
      if (value !== undefined && value !== null && value !== '') {
        // Type assertion to ensure TypeScript knows we're assigning to a valid key
        (queryParams as any)[key] = value;
      }
    });
    
    // Add companyId directly or from company object if it exists
    if (companyId) {
      queryParams.companyId = companyId;
    } else if (company) {
      // If company is an object, use its ID
      queryParams.companyId = company.id;
    }
    
    // Add min/max years of experience if they exist
    if (yearOfExperienceRange?.min !== undefined && yearOfExperienceRange.min !== null) {
      queryParams['yearOfExperienceRange.min'] = yearOfExperienceRange.min;
    }
    
    if (yearOfExperienceRange?.max !== undefined && yearOfExperienceRange.max !== null) {
      queryParams['yearOfExperienceRange.max'] = yearOfExperienceRange.max;
    }
    
    return queryParams;
  }
} 