import { inject, Injectable } from '@angular/core';
import { ResumeFormData } from '../models/resume-form-data';
import { Observable } from 'rxjs';
import { CreateResumeModel } from '../models/create-resume.model';
import { ApiService } from '@app/core/services/api.service';

@Injectable({
  providedIn: 'root',
})
export class UserResumesService {
  private apiService = inject(ApiService);
  private readonly apiEndpoint = '/resumes';
  constructor() {}

  /**
   * Add a new resume with file attachment
   */
  addResume(resumeData: ResumeFormData): Observable<any> {
    // Transform form data to match API requirements
    const apiRequest: CreateResumeModel = {
      isHrScreeningPassed: resumeData.status === 'Approved',
      companyId: resumeData.companyName,
      yearsOfExperience: resumeData.yearsOfExperience,
      speciality: resumeData.specialization,
      document: resumeData.file,
    };

    // Convert request object to FormData using ApiService's helper method
    const formData = this.apiService.createFormData(apiRequest);

    return this.apiService.post<FormData, any>(this.apiEndpoint, formData);
  }
}
