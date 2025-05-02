import { Company } from '@app/core/models/company.model';

export interface ResumeFilters {
  companyId?: string;
  company?: Company; // Keep for backward compatibility and internal use
  speciality?: string;
  isHrScreeningPassed?: boolean | null;
  yearOfExperienceRange?: {
    min?: number | null;
    max?: number | null;
  };
  date?: string;
  page?: number;
  pageSize?: number;
  orderBy?: 'Date' | 'Company' | 'Status';
  sortOrder?: 'Ascending' | 'Descending';
} 