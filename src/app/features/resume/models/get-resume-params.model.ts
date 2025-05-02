import { QueryParamsModel } from '@app/core/models/query-params-model';

export interface GetResumeParamsModel extends QueryParamsModel {
  company?: string;
  companyId?: string;
  speciality?: string;
  isHrScreeningPassed?: boolean;
  'yearOfExperienceRange.min'?: number;
  'yearOfExperienceRange.max'?: number;
  date?: string;
  page?: number;
  pageSize?: number;
  orderBy?: 'Date' | 'Company' | 'Status';
  sortOrder?: 'Ascending' | 'Descending';
}