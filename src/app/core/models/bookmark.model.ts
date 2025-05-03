import { PrivateResume } from '@app/features/resume/models/resume.model';

/**
 * Raw bookmark data interface as received from API
 */
export interface BookmarkData {
  id: string;
  resumeId: string;
  resume?: any;
  createdAt: string;
}

/**
 * Bookmark response interface
 */
export interface BookmarkResponse {
  data: Bookmark[];
  totalCount: number;
}

/**
 * Bookmark model class
 */
export class Bookmark {
  id: string;
  resumeId: string;
  resume?: PrivateResume;
  createdAt: Date;

  constructor(
    id: string,
    resumeId: string,
    createdAt: Date,
    resume?: PrivateResume
  ) {
    this.id = id;
    this.resumeId = resumeId;
    this.createdAt = createdAt;
    this.resume = resume;
  }

  /**
   * Creates a Bookmark instance from JSON data
   */
  static fromJson(json: unknown): Bookmark {
    const data = json as BookmarkData;
    
    return new Bookmark(
      data.id || '',
      data.resumeId || '',
      data.createdAt ? new Date(data.createdAt) : new Date(),
      data.resume ? PrivateResume.fromJson(data.resume) : undefined
    );
  }

  /**
   * Converts the Bookmark instance to a JSON object
   */
  toJson(): BookmarkData {
    return {
      id: this.id,
      resumeId: this.resumeId,
      createdAt: this.createdAt.toISOString(),
      resume: this.resume ? this.resume.toJson() : undefined
    };
  }
} 