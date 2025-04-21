import { Injectable, signal } from '@angular/core';
import { Resume } from '../models/resume.model';

@Injectable({
  providedIn: 'root'
})
export class ResumeStateService {
  private readonly STORAGE_KEY = 'selectedResume';
  private selectedResumeSignal = signal<Resume | null>(this.getStoredResume());

  get selectedResume() {
    return this.selectedResumeSignal;
  }

  setSelectedResume(resume: Resume) {
    this.selectedResumeSignal.set(resume);
    this.storeResume(resume);
  }

  clearSelectedResume() {
    this.selectedResumeSignal.set(null);
    localStorage.removeItem(this.STORAGE_KEY);
  }

  private storeResume(resume: Resume): void {
    localStorage.setItem(this.STORAGE_KEY, JSON.stringify(resume));
  }

  private getStoredResume(): Resume | null {
    const storedResume = localStorage.getItem(this.STORAGE_KEY);
    if (!storedResume) {
      return null;
    }
    
    try {
      return JSON.parse(storedResume) as Resume;
    } catch (e) {
      console.error('Error parsing stored resume:', e);
      localStorage.removeItem(this.STORAGE_KEY);
      return null;
    }
  }
} 