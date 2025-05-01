/**
 * Interface representing the API request structure for creating a new resume
 */
export interface CompanyResumeInfo {
  id: string | number;
  isHrScreeningPassed: boolean;
}

export interface CreateResumeModel {
  companies: CompanyResumeInfo[];
  yearsOfExperience: number;
  speciality: string;
  document: File;
} 