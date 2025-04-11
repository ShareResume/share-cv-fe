import { Resume } from './resume.model';

export interface ResumeResponse {
  data: Resume[];
  totalCount: number;
} 