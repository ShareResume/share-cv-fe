import { Component, OnInit, inject, signal } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ResumeStateService } from '../../services/resume-state.service';
import { Resume } from '../../models/resume.model';
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
  
  resume = signal<Resume | null>(null);
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
      this.resume.set(selectedResume);
      //TODO: retrieve from BE
      this.resumeUrl.set(`https://s29.q4cdn.com/175625835/files/doc_downloads/test.pdf`);
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
} 