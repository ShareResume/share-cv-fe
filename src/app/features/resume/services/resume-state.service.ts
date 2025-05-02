import { Injectable, signal } from '@angular/core';
import { PublicResume } from '../models/resume.model';

@Injectable({
  providedIn: 'root'
})
export class ResumeStateService {
  private readonly STORAGE_KEY = 'selectedResume';
  private selectedResumeSignal = signal<PublicResume | null>(this.getStoredResume());

  get selectedResume() {
    return this.selectedResumeSignal;
  }

  setSelectedResume(resume: PublicResume) {
    this.selectedResumeSignal.set(resume);
    this.storeResume(resume);
  }

  clearSelectedResume() {
    this.selectedResumeSignal.set(null);
    localStorage.removeItem(this.STORAGE_KEY);
  }

  private storeResume(resume: PublicResume): void {
    localStorage.setItem(this.STORAGE_KEY, JSON.stringify(resume.toJson()));
  }

  private getStoredResume(): PublicResume | null {
    const storedResume = localStorage.getItem(this.STORAGE_KEY);
    if (!storedResume) {
      return null;
    }
    
    try {
      const resumeData = JSON.parse(storedResume);
      // Use PublicResume.fromJson to create the appropriate resume type
      return PublicResume.fromJson(resumeData);
    } catch (e) {
      console.error('Error parsing stored resume:', e);
      localStorage.removeItem(this.STORAGE_KEY);
      return null;
    }
  }
} 