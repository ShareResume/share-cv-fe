import { inject, Injectable } from '@angular/core';
import { ResumeFormData, CompanyStatusInfo } from '../models/resume-form-data';
import { Observable } from 'rxjs';
import { CreateResumeModel, CompanyResumeInfo } from '../models/create-resume.model';
import { ApiService } from '@app/core/services/api.service';
import { PrivateResume } from '../models/resume.model';

@Injectable({
  providedIn: 'root',
})
export class UserResumesService {
  private apiService = inject(ApiService);
  private readonly apiEndpoint = '/resumes';
  constructor() {}

  /**
   * Add a new resume with file attachment and multiple companies
   */
  addResume(resumeData: ResumeFormData): Observable<any> {
    // Map each company and its status to the API format
    const companiesInfo: CompanyResumeInfo[] = resumeData.companies.map(company => ({
      id: company.companyId,
      isHrScreeningPassed: company.status === 'Approved'
    }));

    // Transform form data to match API requirements
    const apiRequest: CreateResumeModel = {
      companies: companiesInfo,
      yearsOfExperience: resumeData.yearsOfExperience,
      speciality: resumeData.specialization,
      document: resumeData.file,
    };

    // Convert request object to FormData using ApiService's helper method
    const formData = this.apiService.createFormData(apiRequest);

    return this.apiService.post<FormData, any>(this.apiEndpoint, formData);
  }

  /**
   * Get all resumes for admin view
   */
  getResumes(): Observable<PrivateResume[]> {
    return this.apiService.get<PrivateResume[]>(this.apiEndpoint);
  }
}
