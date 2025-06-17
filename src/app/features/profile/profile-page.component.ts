import { Component, DestroyRef, OnInit, inject } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { MatTabsModule } from '@angular/material/tabs';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatDividerModule } from '@angular/material/divider';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { PrivateResume, PublicResume } from '@app/features/resume/models/resume.model';
import { BookmarkService } from '@app/core/services/bookmark.service';
import { Bookmark } from '@app/core/models/bookmark.model';
import { ResumeService } from '@app/features/resume/services/resume.service';
import { UserResumesService } from '@app/features/resume/services/user-resumes.service';
import { finalize, forkJoin, of } from 'rxjs';
import { ToasterService } from '@app/core/services/toaster.service';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { Router } from '@angular/router';
import { ResumeStateService } from '@app/features/resume/services/resume-state.service';

@Component({
  selector: 'app-profile-page',
  standalone: true,
  imports: [
    CommonModule,
    MatTabsModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatDividerModule,
    DatePipe,
    MatSnackBarModule,
    TranslateModule
  ],
  templateUrl: './profile-page.component.html',
  styleUrls: ['./profile-page.component.scss'],
})
export class ProfilePageComponent implements OnInit {
  private bookmarkService = inject(BookmarkService);
  private resumeService = inject(ResumeService);
  private userResumesService = inject(UserResumesService);
  private toasterService = inject(ToasterService);
  private destroyRef = inject(DestroyRef);
  private translateService = inject(TranslateService);
  private router = inject(Router);
  private resumeStateService = inject(ResumeStateService);

  myResumes: PrivateResume[] = [];
  bookmarks: Bookmark[] = [];
  
  isLoading = {
    resumes: false,
    bookmarks: false
  };

  ngOnInit(): void {
    this.loadMyResumes();
    this.loadBookmarks();
  }

  loadMyResumes(): void {
    this.isLoading.resumes = true;
    this.userResumesService.getResumes().pipe(
      takeUntilDestroyed(this.destroyRef),
      finalize(() => this.isLoading.resumes = false)
    ).subscribe({
      next: (resumes) => {
        this.myResumes = resumes;
      },
      error: (error) => {
        console.error('Error loading user resumes:', error);
        this.showError(this.translateService.instant('profile.loadingResumesError'));
      }
    });
  }

  loadBookmarks(): void {
    this.isLoading.bookmarks = true;
    this.bookmarkService.getBookmarks().pipe(
      takeUntilDestroyed(this.destroyRef),
      finalize(() => this.isLoading.bookmarks = false)
    ).subscribe({
      next: (response) => {
        this.bookmarks = response.data;
      },
      error: (error) => {
        console.error('Error loading bookmarks:', error);
        this.showError(this.translateService.instant('profile.loadingBookmarksError'));
      }
    });
  }

  refreshData(): void {
    forkJoin({
      resumes: of(this.loadMyResumes()),
      bookmarks: of(this.loadBookmarks())
    }).subscribe();
  }

  viewResume(resumeId: string): void {
    console.log(`Viewing resume with ID: ${resumeId}`);
    
    const resume = this.myResumes.find(r => r.id === resumeId);
    if (resume) {
      try {
        const publicResume = PublicResume.fromJson(resume.toJson());
        this.resumeStateService.setSelectedResume(publicResume);
        this.router.navigate(['/resumes', resumeId]);
      } catch (error: any) {
        console.error('Error converting private resume to public resume:', error);
        this.showError(this.translateService.instant('profile.resumeNavigationError'));
      }
    } else {
      this.router.navigate(['/resumes', resumeId]);
    }
  }

  hideResume(resumeId: string): void {
    const resume = this.myResumes.find(r => r.id === resumeId);
    if (!resume) {
      this.showError(this.translateService.instant('profile.resumeNotFound'));
      return;
    }

    const newHiddenStatus = !resume.hidden;
    
    this.userResumesService.updateResumeVisibility(resumeId, newHiddenStatus).pipe(
      takeUntilDestroyed(this.destroyRef)
    ).subscribe({
      next: () => {
        const message = newHiddenStatus 
          ? this.translateService.instant('profile.resumeHiddenSuccess')
          : this.translateService.instant('profile.resumeShownSuccess');
        this.showSuccess(message);
        this.loadMyResumes();
      },
      error: (error) => {
        this.showError(this.translateService.instant('profile.resumeVisibilityUpdateError'));
      }
    });
  }

  deleteResume(resumeId: string): void {
    console.log(`Deleting resume with ID: ${resumeId}`);

    this.myResumes = this.myResumes.filter(resume => resume.id !== resumeId);
    this.showSuccess(this.translateService.instant('profile.resumeDeletedSuccess'));
  }

  openBookmark(bookmark: Bookmark): void {
    
    if (!bookmark.resumeId) {
      this.showError(this.translateService.instant('profile.bookmarkError'));
      return;
    }

    if (bookmark.resume) {
      try {
        const publicResume = PublicResume.fromJson(bookmark.resume);
        this.resumeStateService.setSelectedResume(publicResume);
        this.router.navigate(['/resumes', bookmark.resumeId]);
      } catch (error: any) {
        this.showError(this.translateService.instant('profile.bookmarkNavigationError'));
      }
    } else {
      this.router.navigate(['/resumes', bookmark.resumeId]);
    }
  }

  removeBookmark(bookmark: Bookmark): void {
    this.bookmarkService.removeBookmark(bookmark.resumeId).pipe(
      takeUntilDestroyed(this.destroyRef)
    ).subscribe({
      next: (success) => {
        if (success) {
          console.log(`Removed bookmark with ID: ${bookmark.id}`);
          this.bookmarks = this.bookmarks.filter(b => b.id !== bookmark.id);
          this.showSuccess(this.translateService.instant('profile.bookmarkRemovedSuccess'));
        } else {
          this.showError(this.translateService.instant('profile.bookmarkRemoveError'));
        }
      },
      error: (error) => {
        console.error('Error removing bookmark:', error);
        this.showError(this.translateService.instant('profile.bookmarkRemoveError'));
      }
    });
  }

  getStatusText(status: string): string {
    const statusMap: Record<string, string> = {
      'PUBLISHED': this.translateService.instant('resume.status.published'),
      'WAITING_FOR_APPROVE': this.translateService.instant('resume.status.waitingForApprove'),
      'REJECTED': this.translateService.instant('resume.status.rejected'),
      'APPROVED': this.translateService.instant('resume.status.approved')
    };
    
    return statusMap[status] || status;
  }

  private showSuccess(message: string): void {
    this.toasterService.showSuccess(message);
  }

  private showError(message: string): void {
    this.toasterService.showError(message);
  }
} 