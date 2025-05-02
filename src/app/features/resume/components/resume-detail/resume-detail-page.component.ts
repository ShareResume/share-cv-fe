import { Component, OnInit, inject, signal } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ResumeStateService } from '../../services/resume-state.service';
import { PublicResume } from '../../models/resume.model';
import { ButtonComponent } from '../../../../reusable/button/button.component';
import { DatePipe, NgClass } from '@angular/common';
import { ChipsComponent } from '../../../../reusable/chips/chips.component';
import { ResumeDetailCommentsComponent } from './resume-detail-comments.component';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';

@Component({
  selector: 'app-resume-detail-page',
  templateUrl: './resume-detail-page.component.html',
  styleUrl: './resume-detail-page.component.scss',
  standalone: true,
  imports: [
    ButtonComponent,
    DatePipe,
    ResumeDetailCommentsComponent
  ],
})
export class ResumeDetailPageComponent implements OnInit {
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private resumeStateService = inject(ResumeStateService);
  private sanitizer = inject(DomSanitizer);
  
  resume = signal<PublicResume | null>(null);
  resumeUrl = signal<string | null>(null);
  error = signal<string | null>(null);
  
  ngOnInit(): void {
    const resumeId = this.route.snapshot.paramMap.get('id');
    if (!resumeId) {
      this.error.set('Resume ID not found');
      return;
    }
    
    const selectedResume = this.resumeStateService.selectedResume();
    
    if (selectedResume && selectedResume.id === resumeId) {
      // Ensure we're working with a PublicResume
      if (this.isPublicResume(selectedResume)) {
        this.resume.set(selectedResume);
        this.resumeUrl.set(selectedResume.document?.url || null);
      } else {
        this.error.set('Invalid resume format');
      }
    } else if (resumeId) {
      // If we don't have the resume or it doesn't match the ID, redirect back to the list
      this.error.set('Resume not found');
      this.router.navigate(['/resumes']);
    }
  }
  
  navigateBack(): void {
    this.router.navigate(['/resumes']);
  }
  
  /**
   * Returns a sanitized URL for the PDF to safely use in an iframe
   */
  safePdfUrl(): SafeResourceUrl {
    return this.resumeUrl() 
      ? this.sanitizer.bypassSecurityTrustResourceUrl(this.resumeUrl()!)
      : this.sanitizer.bypassSecurityTrustResourceUrl('');
  }

  /**
   * Get the formatted published date
   */
  getPublishedDate(): string {
    if (!this.resume()) return 'N/A';
    return this.resume()!.date ? this.formatDate(this.resume()!.date) : 'N/A';
  }

  /**
   * Format date as MMM d, y
   */
  private formatDate(date: Date): string {
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    return `${months[date.getMonth()]} ${date.getDate()}, ${date.getFullYear()}`;
  }

  /**
   * Type guard to check if a resume is a PublicResume
   */
  private isPublicResume(resume: any): resume is PublicResume {
    return resume && 'document' in resume && 'date' in resume;
  }
} 