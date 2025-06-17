import { inject, Injectable } from '@angular/core';
import { ResumeFormData, CompanyStatusInfo } from '../models/resume-form-data';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { CreateResumeModel, CompanyResumeInfo } from '../models/create-resume.model';
import { ApiService } from '@app/core/services/api.service';
import { PrivateResume, ResumeStatusEnum, PublicResume } from '../models/resume.model';

@Injectable({
  providedIn: 'root',
})
export class UserResumesService {
  private apiService = inject(ApiService);
  private readonly apiEndpoint = '/resumes';
  private readonly publicUsersResumesEndpoint = '/public-users-resumes';
  constructor() {}

  addResume(resumeData: ResumeFormData): Observable<any> {
    const companiesInfo: CompanyResumeInfo[] = resumeData.companies.map(company => ({
      id: company.companyId,
      isHrScreeningPassed: company.status === 'Approved'
    }));

    const apiRequest: CreateResumeModel = {
      companies: companiesInfo,
      yearsOfExperience: resumeData.yearsOfExperience,
      speciality: resumeData.specialization,
      document: resumeData.file,
    };

    const formData = this.apiService.createFormData(apiRequest);

    return this.apiService.post<FormData, any>(this.apiEndpoint, formData);
  }

  getResumes(): Observable<PrivateResume[]> {
    return this.apiService.get<any[]>(this.apiEndpoint).pipe(
      map((response: any[]) => response.map(item => PrivateResume.fromJson(item)))
    );
  }

  getResumeById(resumeId: string): Observable<PrivateResume> {
    return this.apiService.get<any>(`${this.apiEndpoint}/${resumeId}`).pipe(
      map((response: any) => PrivateResume.fromJson(response))
    );
  }

  getPublicResumeById(resumeId: string): Observable<PublicResume> {
    return this.apiService.get<any>(`${this.publicUsersResumesEndpoint}/${resumeId}`).pipe(
      map((response: any) => PublicResume.fromJson(response))
    );
  }

  updateResumeStatus(resumeId: string, status: ResumeStatusEnum): Observable<any> {
    const requestBody = {
      resumeEvent: status === ResumeStatusEnum.APPROVED ? 'APPROVED' : 'REJECTED'
    };
    
    return this.apiService.patch<any, any>(`${this.apiEndpoint}/${resumeId}`, requestBody);
  }

  uploadEditedDocument(resumeId: string, file: File): Observable<any> {
    const formData = new FormData();
    formData.append('file', file);
    
    return this.apiService.patch<FormData, any>(`${this.publicUsersResumesEndpoint}/${resumeId}`, formData);
  }

  updateResumeVisibility(resumeId: string, isHidden: boolean): Observable<any> {
    const requestBody = { isHidden };
    return this.apiService.patch<any, any>(`${this.apiEndpoint}/${resumeId}`, requestBody);
  }
}
