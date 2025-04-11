export interface ResumeFilters {
  company?: string;
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