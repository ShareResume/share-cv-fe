import { Component, OnInit, inject, signal, computed, DestroyRef } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { DatePipe, NgClass } from '@angular/common';
import { ButtonComponent } from '../../../reusable/button/button.component';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { PrivateResume, ResumeStatusEnum } from '../../resume/models/resume.model';
import { AdminResumeStateService } from '../services/admin-resume-state.service';
import { UserResumesService } from '../../resume/services/user-resumes.service';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

@Component({
  selector: 'app-admin-resume-detail-page',
  templateUrl: './admin-resume-detail-page.component.html',
  styleUrl: './admin-resume-detail-page.component.scss',
  standalone: true,
  imports: [
    ButtonComponent,
    DatePipe,
    NgClass
  ],
})
export class AdminResumeDetailPageComponent implements OnInit {
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private sanitizer = inject(DomSanitizer);
  private adminResumeStateService = inject(AdminResumeStateService);
  private userResumesService = inject(UserResumesService);
  private destroyRef = inject(DestroyRef);
  
  resume = signal<PrivateResume | null>(null);
  error = signal<string | null>(null);
  isUpdating = signal<boolean>(false);
  
  // Computed signals for safe PDF URLs
  privateDocumentUrl = computed(() => {
    const resume = this.resume();
    return resume ? resume.getPrivateDocumentUrl() : null;
  });
  
  publicDocumentUrl = computed(() => {
    const resume = this.resume();
    return resume ? resume.getPublicDocumentUrl() : null;
  });
  
  // Safe URLs for iframe display
  safePrivateDocUrl = computed<SafeResourceUrl>(() => {
    return this.privateDocumentUrl() 
      ? this.sanitizer.bypassSecurityTrustResourceUrl(this.privateDocumentUrl()!)
      : this.sanitizer.bypassSecurityTrustResourceUrl('');
  });
  
  safePublicDocUrl = computed<SafeResourceUrl>(() => {
    return this.publicDocumentUrl() 
      ? this.sanitizer.bypassSecurityTrustResourceUrl(this.publicDocumentUrl()!)
      : this.sanitizer.bypassSecurityTrustResourceUrl('');
  });
  
  // Status for UI display
  resumeStatus = computed(() => {
    return this.resume()?.resumeStatus || ResumeStatusEnum.WAITING_FOR_APPROVE;
  });
  
  ngOnInit(): void {
    const resumeId = this.route.snapshot.paramMap.get('id');
    if (!resumeId) {
      this.error.set('Resume ID not found');
      return;
    }
    
    const selectedResume = this.adminResumeStateService.selectedResume();
    
    if (selectedResume && selectedResume.id === resumeId) {
      this.resume.set(selectedResume);
    } else {
      this.error.set('Resume not found');
      this.navigateBack();
    }
  }
  
  navigateBack(): void {
    this.router.navigate(['/admin']);
  }
  
  approveResume(): void {
    if (this.resume()) {
      this.isUpdating.set(true);
      
      this.userResumesService.updateResumeStatus(
        this.resume()!.id, 
        ResumeStatusEnum.APPROVED
      )
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: () => {
          // Create a new PrivateResume instance with updated status
          const currentResume = this.resume()!;
          
          const updatedResume = new PrivateResume(
            currentResume.id,
            currentResume.documents,
            currentResume.companies,
            currentResume.speciality,
            currentResume.yearsOfExperience,
            currentResume.createdAt,
            ResumeStatusEnum.APPROVED,
            currentResume.hidden
          );
          
          // Update the local state
          this.resume.set(updatedResume);
          this.adminResumeStateService.setSelectedResume(updatedResume);
          this.isUpdating.set(false);
        },
        error: (err) => {
          this.error.set('Failed to approve resume');
          this.isUpdating.set(false);
          console.error('Error approving resume:', err);
        }
      });
    }
  }
  
  rejectResume(): void {
    if (this.resume()) {
      this.isUpdating.set(true);
      
      this.userResumesService.updateResumeStatus(
        this.resume()!.id, 
        ResumeStatusEnum.REJECTED
      )
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: () => {
          // Create a new PrivateResume instance with updated status
          const currentResume = this.resume()!;
          
          const updatedResume = new PrivateResume(
            currentResume.id,
            currentResume.documents,
            currentResume.companies,
            currentResume.speciality,
            currentResume.yearsOfExperience,
            currentResume.createdAt,
            ResumeStatusEnum.REJECTED,
            currentResume.hidden
          );
          
          // Update the local state
          this.resume.set(updatedResume);
          this.adminResumeStateService.setSelectedResume(updatedResume);
          this.isUpdating.set(false);
        },
        error: (err) => {
          this.error.set('Failed to reject resume');
          this.isUpdating.set(false);
          console.error('Error rejecting resume:', err);
        }
      });
    }
  }
  
  uploadEditedDocument(): void {
    // In a real implementation, this would open a file upload dialog
    // and then make an API call to upload the new document
    console.log('Upload edited document functionality');
    // This would be implemented with a file input and FormData
  }
  
  getFormattedDate(date: Date | null | undefined): string {
    if (!date) return 'N/A';
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    return `${months[date.getMonth()]} ${date.getDate()}, ${date.getFullYear()}`;
  }
  
  getStatusClass(): string {
    switch (this.resumeStatus()) {
      case ResumeStatusEnum.APPROVED:
        return 'status-approved';
      case ResumeStatusEnum.REJECTED:
        return 'status-rejected';
      case ResumeStatusEnum.WAITING_FOR_APPROVE:
        return 'status-waiting';
      default:
        return '';
    }
  }
  
  formatStatusText(): string {
    switch (this.resumeStatus()) {
      case ResumeStatusEnum.APPROVED:
        return 'Approved';
      case ResumeStatusEnum.REJECTED:
        return 'Rejected';
      case ResumeStatusEnum.WAITING_FOR_APPROVE:
        return 'Waiting for Approval';
      default:
        return this.resumeStatus() ? String(this.resumeStatus()) : 'Unknown';
    }
  }
} 