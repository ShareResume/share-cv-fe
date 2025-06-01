import { inject, Injectable } from '@angular/core';
import { ResumeFormData, CompanyStatusInfo } from '../models/resume-form-data';
import { Observable } from 'rxjs';
import { CreateResumeModel, CompanyResumeInfo } from '../models/create-resume.model';
import { ApiService } from '@app/core/services/api.service';
import { PrivateResume, ResumeStatusEnum } from '../models/resume.model';

@Injectable({
  providedIn: 'root',
})
export class UserResumesService {
  private apiService = inject(ApiService);
  private readonly apiEndpoint = '/resumes';
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
    return this.apiService.get<PrivateResume[]>(this.apiEndpoint);
  }

  updateResumeStatus(resumeId: string, status: ResumeStatusEnum): Observable<any> {
    const requestBody = {
      resumeEvent: status === ResumeStatusEnum.APPROVED ? 'APPROVED' : 'REJECTED'
    };
    
    return this.apiService.patch<any, any>(`${this.apiEndpoint}/${resumeId}`, requestBody);
  }
}
