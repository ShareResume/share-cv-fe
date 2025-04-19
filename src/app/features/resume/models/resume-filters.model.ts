import { Company } from '@app/core/models/company.model';

export interface ResumeFilters {
  company?: Company | string;
  specialization?: string;
  status?: string;
  yearsOfExperience?: {
    min?: number | null;
    max?: number | null;
  };
  date?: string;
  page?: number;
  pageSize?: number;
  orderBy?: 'Date' | 'Company' | 'Status';
  sortOrder?: 'Ascending' | 'Descending';
} 