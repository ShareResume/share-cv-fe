import { Component, OnInit, inject, signal, computed } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ResumeStateService } from '../../services/resume-state.service';
import { PublicResume } from '../../models/resume.model';
import { ButtonComponent } from '../../../../reusable/button/button.component';
import { DatePipe, NgClass } from '@angular/common';
import { ChipsComponent } from '../../../../reusable/chips/chips.component';
import { ResumeDetailCommentsComponent } from './resume-detail-comments.component';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { BookmarkService } from '../../../../core/services/bookmark.service';
import { UserResumesService } from '../../services/user-resumes.service';

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
  private bookmarkService = inject(BookmarkService);
  private userResumesService = inject(UserResumesService);
  
  resume = signal<PublicResume | null>(null);
  resumeUrl = signal<string | null>(null);
  error = signal<string | null>(null);
  isBookmarked = signal<boolean>(false);
  isBookmarkLoading = signal<boolean>(false);
  isLoading = signal<boolean>(true);
  
  // Computed signal for safe PDF URL that only updates when resumeUrl changes
  safePdfUrl = computed<SafeResourceUrl>(() => {
    return this.resumeUrl() 
      ? this.sanitizer.bypassSecurityTrustResourceUrl(this.resumeUrl()!)
      : this.sanitizer.bypassSecurityTrustResourceUrl('');
  });
  
  ngOnInit(): void {
    const resumeId = this.route.snapshot.paramMap.get('id');
    if (!resumeId) {
      this.error.set('Resume ID not found');
      this.isLoading.set(false);
      return;
    }
    
    this.fetchResumeById(resumeId);
  }

  private fetchResumeById(resumeId: string): void {
    this.isLoading.set(true);
    this.userResumesService.getPublicResumeById(resumeId).subscribe({
      next: (resume) => {
        this.resume.set(resume);
        this.resumeUrl.set(resume.document?.url || null);
        this.checkBookmarkStatus(resume.id);
        // Save to local state
        this.resumeStateService.setSelectedResume(resume);
        this.isLoading.set(false);
      },
      error: (error) => {
        this.error.set('Failed to load resume');
        this.isLoading.set(false);
        this.router.navigate(['/resumes']);
      }
    });
  }
  
  navigateBack(): void {
    this.router.navigate(['/resumes']);
  }

  toggleBookmark(): void {
    const resume = this.resume();
    if (!resume) return;

    this.isBookmarkLoading.set(true);

    if (this.isBookmarked()) {
      // Remove bookmark
      this.bookmarkService.removeBookmark(resume.id).subscribe({
        next: (success) => {
          console.log('Remove bookmark result:', success);
          if (success) {
            this.isBookmarked.set(false);
            console.log('Bookmark removed, new state:', this.isBookmarked());
          }
          this.isBookmarkLoading.set(false);
        },
        error: (error) => {
          this.isBookmarkLoading.set(false);
        }
      });
    } else {
      // Add bookmark
      this.bookmarkService.addBookmark(resume.id).subscribe({
        next: (bookmark) => {
          this.isBookmarked.set(true);
          this.isBookmarkLoading.set(false);
        },
        error: (error) => {
          this.isBookmarkLoading.set(false);
        }
      });
    }
  }
  
  private checkBookmarkStatus(resumeId: string): void {
    this.bookmarkService.isBookmarked(resumeId).subscribe({
      next: (isBookmarked) => {
        this.isBookmarked.set(isBookmarked);
      },
      error: (error) => {
        this.isBookmarked.set(false);
      }
    });
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
} 