import { User, UserData } from './user.model';
import { Company, CompanyData } from './company.model';
import { SpecializationEnum } from '@app/core/enums/specialization.enum';

export interface DocumentData {
  accessType: string;
  url: string;
  name: string;
}

export enum ResumeStatusEnum {
  WAITING_FOR_APPROVE = 'WAITING_FOR_APPROVE',
  APPROVED = 'APPROVED',
  REJECTED = 'REJECTED'
}

export interface BaseResumeData {
  id: string;
  companies: CompanyData[];
  speciality: string;
  yearsOfExperience: number;
}

export interface PublicResumeData extends BaseResumeData {
  document: DocumentData;
  date: string;
}

export interface PrivateResumeData extends BaseResumeData {
  documents: DocumentData[];
  createdAt: string;
  resumeStatus: ResumeStatusEnum;
  hidden: boolean;
}

/**
 * Abstract base class for all resume types
 */
export abstract class Resume {
  id: string;
  companies: Company[];
  speciality: SpecializationEnum;
  yearsOfExperience: number;

  constructor(
    id: string,
    companies: Company[],
    speciality: SpecializationEnum,
    yearsOfExperience: number,
  ) {
    this.id = id;
    this.companies = companies;
    this.speciality = speciality;
    this.yearsOfExperience = yearsOfExperience;
  }

  /**
   * Get HR screening status counts
   */
  getHrScreeningStatusCounts(): { passed: number; notPassed: number } {
    const passed = this.companies.filter(company => company.isHrScreeningPassed).length;
    const notPassed = this.companies.length - passed;
    return { passed, notPassed };
  }

  /**
   * Factory method to create the appropriate resume type from JSON
   */
  static fromJson(json: unknown): Resume {
    // Determine which type of resume this is
    const data = json as any;
    
    if (data.documents && Array.isArray(data.documents) && data.resumeStatus) {
      return PrivateResume.fromJson(data);
    } else if (data.document && data.date) {
      return PublicResume.fromJson(data);
    }
    
    // Default to PrivateResume if can't determine
    return PrivateResume.fromJson(data);
  }

  /**
   * Creates an array of Resume instances from JSON array data
   */
  static fromJsonArray(jsonArray: unknown[]): Resume[] {
    if (!jsonArray || !Array.isArray(jsonArray)) {
      return [];
    }

    return jsonArray.map(json => Resume.fromJson(json));
  }

  /**
   * Get document URL
   */
  abstract getPublicDocumentUrl(): string | null;
  
  /**
   * Get private document URL
   */
  abstract getPrivateDocumentUrl(): string | null;
  
  /**
   * Convert to JSON representation
   */
  abstract toJson(): BaseResumeData;
}

/**
 * Public resume with a single document
 */
export class PublicResume extends Resume {
  document: DocumentData;
  date: Date;

  constructor(
    id: string,
    document: DocumentData,
    companies: Company[],
    speciality: SpecializationEnum,
    yearsOfExperience: number,
    date: Date,
  ) {
    super(id, companies, speciality, yearsOfExperience);
    this.document = document;
    this.date = date;
  }

  /**
   * Creates a PublicResume instance from JSON data
   */
  static override fromJson(json: unknown): PublicResume {
    const data = json as PublicResumeData;

    return new PublicResume(
      data.id || '',
      data.document || { accessType: '', url: '', name: '' },
      data.companies
        ? data.companies.map(company => Company.fromJson(company))
        : [],
      (data.speciality as SpecializationEnum) || SpecializationEnum.Frontend,
      data.yearsOfExperience || 0,
      data.date ? new Date(data.date) : new Date(),
    );
  }

  /**
   * Converts the PublicResume instance to a JSON object
   */
  override toJson(): PublicResumeData {
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
   * Get public document URL
   */
  override getPublicDocumentUrl(): string | null {
    return this.document?.url || null;
  }

  /**
   * Get private document URL - not available for PublicResume
   */
  override getPrivateDocumentUrl(): string | null {
    return null;
  }
}

/**
 * Private resume with multiple documents and admin status
 */
export class PrivateResume extends Resume {
  documents: DocumentData[];
  createdAt: Date;
  resumeStatus: ResumeStatusEnum;
  hidden: boolean;

  constructor(
    id: string,
    documents: DocumentData[],
    companies: Company[],
    speciality: SpecializationEnum,
    yearsOfExperience: number,
    createdAt: Date,
    resumeStatus: ResumeStatusEnum,
    hidden: boolean,
  ) {
    super(id, companies, speciality, yearsOfExperience);
    this.documents = documents;
    this.createdAt = createdAt;
    this.resumeStatus = resumeStatus;
    this.hidden = hidden;
  }

  /**
   * Creates a PrivateResume instance from JSON data
   */
  static override fromJson(json: unknown): PrivateResume {
    const data = json as PrivateResumeData;

    return new PrivateResume(
      data.id || '',
      data.documents || [],
      data.companies
        ? data.companies.map(company => Company.fromJson(company))
        : [],
      (data.speciality as SpecializationEnum) || SpecializationEnum.Frontend,
      data.yearsOfExperience || 0,
      data.createdAt ? new Date(data.createdAt) : new Date(),
      (data.resumeStatus as ResumeStatusEnum) || ResumeStatusEnum.WAITING_FOR_APPROVE,
      data.hidden !== undefined ? data.hidden : false,
    );
  }

  /**
   * Converts the PrivateResume instance to a JSON object
   */
  override toJson(): PrivateResumeData {
    return {
      id: this.id,
      documents: this.documents,
      companies: this.companies.map(company => company.toJson()),
      speciality: this.speciality,
      yearsOfExperience: this.yearsOfExperience,
      createdAt: this.createdAt.toISOString(),
      resumeStatus: this.resumeStatus,
      hidden: this.hidden,
    };
  }

  /**
   * Get public document URL
   */
  override getPublicDocumentUrl(): string | null {
    const publicDoc = this.documents.find(doc => doc.accessType === 'PUBLIC');
    return publicDoc ? publicDoc.url : null;
  }

  /**
   * Get private document URL
   */
  override getPrivateDocumentUrl(): string | null {
    const privateDoc = this.documents.find(doc => doc.accessType === 'PRIVATE');
    return privateDoc ? privateDoc.url : null;
  }
}
