import { User, UserData } from './user.model';
import { Company, CompanyData } from './company.model';
import { SpecializationEnum } from './specialization.enum';

export interface DocumentData {
  accessType: string;
  url: string;
  name: string;
}

export interface ResumeData {
  id: string;
  document: DocumentData;
  companies: CompanyData[];
  speciality: string;
  yearsOfExperience: number;
  date: string;
}

export class Resume {
  id: string;
  document: {
    accessType: string;
    url: string;
    name: string;
  };
  companies: Company[];
  speciality: SpecializationEnum;
  yearsOfExperience: number;
  date: Date;

  constructor(
    id: string,
    document: {
      accessType: string;
      url: string;
      name: string;
    },
    companies: Company[],
    speciality: SpecializationEnum,
    yearsOfExperience: number,
    date: Date,
  ) {
    this.id = id;
    this.document = document;
    this.companies = companies;
    this.speciality = speciality;
    this.yearsOfExperience = yearsOfExperience;
    this.date = date;
  }

  /**
   * Creates a Resume instance from JSON data
   */
  static fromJson(json: unknown): Resume {
    const data = json as ResumeData;

    return new Resume(
      data.id || '',
      data.document || { accessType: '', url: '', name: '' },
      data.companies
        ? data.companies.map(company => Company.fromJson(company))
        : [],
      (data.speciality as SpecializationEnum) || SpecializationEnum.FRONTEND,
      data.yearsOfExperience || 0,
      data.date ? new Date(data.date) : new Date(),
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
      document: this.document,
      companies: this.companies.map(company => company.toJson()),
      speciality: this.speciality,
      yearsOfExperience: this.yearsOfExperience,
      date: this.date.toISOString().split('T')[0],
    };
  }

  /**
   * Get HR screening status counts
   */
  getHrScreeningStatusCounts(): { passed: number; notPassed: number } {
    const passed = this.companies.filter(company => company.isHrScreeningPassed).length;
    const notPassed = this.companies.length - passed;
    return { passed, notPassed };
  }
}
