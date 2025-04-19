import { QueryParamsModel } from '@app/core/models/query-params-model';

export interface GetResumeParamsModel extends QueryParamsModel {
  company?: string;
  companyId?: string;
  specialization?: string;
  status?: string;
  minYoe?: number;
  maxYoe?: number;
  date?: string;
  page?: number;
  pageSize?: number;
  orderBy?: 'Date' | 'Company' | 'Status';
  sortOrder?: 'Ascending' | 'Descending';
}