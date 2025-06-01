import { Injectable, inject } from '@angular/core';
import { Observable, map } from 'rxjs';
import { ApiService } from '@app/core/services/api.service';
import { PublicResume, PublicResumeData } from '../models/resume.model';
import { GetResumeParamsModel } from '../models/get-resume-params.model';
import { HttpClient } from '@angular/common/http';
import { environment } from '@environments/environment';
import { ResumeFilters } from '../models/resume-filters.model';
import { ResumeResponse } from '../models/resume-response.model';

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

  private readonly DEFAULT_PAGE_SIZE = 10;
  private readonly DEFAULT_PAGE_NUMBER = 1;
  private readonly DEFAULT_ORDER_BY = 'Date';
  private readonly DEFAULT_SORT_ORDER = 'Descending';

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
        
        const totalCountHeader = response.headers.get('X-Total-Count');

        if (totalCountHeader) {
          const count = parseInt(totalCountHeader, 10);

          if (!isNaN(count)) {
            totalCount = count;
          }
        }
        
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
  
  private isValidOrderBy(orderBy?: string): orderBy is 'Date' | 'Company' | 'Status' {
    return !!orderBy && ['Date', 'Company', 'Status'].includes(orderBy);
  }
  
  private isValidSortOrder(sortOrder?: string): sortOrder is 'Ascending' | 'Descending' {
    return !!sortOrder && ['Ascending', 'Descending'].includes(sortOrder);
  }
  
  private transformFiltersToQueryParams(filters?: ResumeFilters): GetResumeParamsModel {
    if (!filters) {
      return {};
    }
    
    const { yearOfExperienceRange, company, companyId, ...basicFilters } = filters;
    
    const queryParams = {} as GetResumeParamsModel;
    
    Object.entries(basicFilters).forEach(([key, value]) => {
      if (value !== undefined && value !== null && value !== '') {
        (queryParams as any)[key] = value;
      }
    });
    
    if (companyId) {
      queryParams.companyId = companyId;
    } else if (company) {
      queryParams.companyId = company.id;
    }
    
    if (yearOfExperienceRange?.min !== undefined && yearOfExperienceRange.min !== null) {
      queryParams['yearOfExperienceRange.min'] = yearOfExperienceRange.min;
    }
    
    if (yearOfExperienceRange?.max !== undefined && yearOfExperienceRange.max !== null) {
      queryParams['yearOfExperienceRange.max'] = yearOfExperienceRange.max;
    }
    
    return queryParams;
  }
}