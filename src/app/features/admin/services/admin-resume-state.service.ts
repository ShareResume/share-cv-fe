import { Injectable, signal } from '@angular/core';
import { PrivateResume } from '../../resume/models/resume.model';

@Injectable({
  providedIn: 'root'
})
export class AdminResumeStateService {
  private readonly STORAGE_KEY = 'adminSelectedResume';
  private selectedResumeSignal = signal<PrivateResume | null>(this.getStoredResume());

  get selectedResume() {
    return this.selectedResumeSignal;
  }

  setSelectedResume(resume: PrivateResume) {
    console.log('Setting selected resume in state service:', resume);
    this.selectedResumeSignal.set(resume);
    this.storeResume(resume);
  }

  clearSelectedResume() {
    this.selectedResumeSignal.set(null);
    sessionStorage.removeItem(this.STORAGE_KEY);
  }

  private storeResume(resume: PrivateResume): void {
    try {
      const resumeJson = resume.toJson();
      const resumeString = JSON.stringify(resumeJson);
      console.log('Storing resume in session storage:', resumeJson);
      sessionStorage.setItem(this.STORAGE_KEY, resumeString);
    } catch (e) {
      console.error('Error storing admin resume in session storage:', e);
    }
  }

  private getStoredResume(): PrivateResume | null {
    try {
      const storedResume = sessionStorage.getItem(this.STORAGE_KEY);
      if (!storedResume) {
        return null;
      }
      
      const resumeData = JSON.parse(storedResume);
      console.log('Retrieved resume from session storage:', resumeData);
      // Use PrivateResume.fromJson to create the appropriate resume type
      return PrivateResume.fromJson(resumeData);
    } catch (e) {
      console.error('Error parsing stored admin resume:', e);
      sessionStorage.removeItem(this.STORAGE_KEY);
      return null;
    }
  }
} 