/**
 * Interface representing the API request structure for creating a new resume
 */
export interface CreateResumeModel {
  isHrScreeningPassed: boolean;
  companyId: string;
  yearsOfExperience: number;
  speciality: string;
  document: File;
} 