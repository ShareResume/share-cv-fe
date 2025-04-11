import { User, UserData } from './user.model';
import { Company, CompanyData } from './company.model';
import { SpecializationEnum } from './specialization.enum';

export interface ResumeData {
  id: string;
  author: UserData;
  company: CompanyData;
  jobTitle: string;
  status: string;
  yearsOfExperience: number;
  timestamp: string | Date;
}

export class Resume {
  id: string;
  author: User;
  company: Company;
  jobTitle: SpecializationEnum;
  status: 'Pending' | 'Accepted' | 'Rejected';
  yearsOfExperience: number;
  timestamp: Date;

  constructor(
    id: string,
    author: User,
    company: Company,
    jobTitle: SpecializationEnum,
    status: 'Pending' | 'Accepted' | 'Rejected',
    yearsOfExperience: number,
    timestamp: Date
  ) {
    this.id = id;
    this.author = author;
    this.company = company;
    this.jobTitle = jobTitle;
    this.status = status;
    this.yearsOfExperience = yearsOfExperience;
    this.timestamp = timestamp;
  }

  /**
   * Creates a Resume instance from JSON data
   */
  static fromJson(json: unknown): Resume {
    const data = json as ResumeData;
    
    return new Resume(
      data.id || '',
      User.fromJson(data.author),
      Company.fromJson(data.company),
      data.jobTitle as SpecializationEnum || SpecializationEnum.FRONTEND,
      (data.status as 'Pending' | 'Accepted' | 'Rejected') || 'Pending',
      data.yearsOfExperience || 0,
      data.timestamp ? new Date(data.timestamp) : new Date()
    );
  }

  /**
   * Creates an array of Resume instances from JSON array data
   */
  static fromJsonArray(jsonArray: unknown[]): Resume[] {
    if (!jsonArray || !Array.isArray(jsonArray)) {
      return [];
    }

    return jsonArray.map(json => this.fromJson(json));
  }

  /**
   * Converts the Resume instance to a JSON object
   */
  toJson(): ResumeData {
    return {
      id: this.id,
      author: this.author.toJson(),
      company: this.company.toJson(),
      jobTitle: this.jobTitle,
      status: this.status,
      yearsOfExperience: this.yearsOfExperience,
      timestamp: this.timestamp.toISOString()
    };
  }
} 