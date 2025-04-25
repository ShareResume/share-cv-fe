export interface CompanyStatusInfo {
  companyId: string | number;
  status: string;
}

export interface ResumeFormData {
  companies: CompanyStatusInfo[];
  yearsOfExperience: number;
  specialization: string;
  file: File;
}