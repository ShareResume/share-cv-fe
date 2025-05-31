import { Component, DestroyRef, OnInit, inject } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { MatTabsModule } from '@angular/material/tabs';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatDividerModule } from '@angular/material/divider';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { PrivateResume } from '@app/features/resume/models/resume.model';
import { BookmarkService } from '@app/core/services/bookmark.service';
import { Bookmark } from '@app/core/models/bookmark.model';
import { ResumeService } from '@app/features/resume/services/resume.service';
import { UserResumesService } from '@app/features/resume/services/user-resumes.service';
import { finalize, forkJoin, of } from 'rxjs';
import { ToasterService } from '@app/core/services/toaster.service';
import { TranslateModule, TranslateService } from '@ngx-translate/core';

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
    // Navigate to resume detail page
  }

  editResume(resumeId: string): void {
    console.log(`Editing resume with ID: ${resumeId}`);
    // Navigate to resume edit page
  }

  deleteResume(resumeId: string): void {
    console.log(`Deleting resume with ID: ${resumeId}`);
    // Here you would call a service to delete the resume

    // For demo purposes, we're just filtering it out
    this.myResumes = this.myResumes.filter(resume => resume.id !== resumeId);
    this.showSuccess(this.translateService.instant('profile.resumeDeletedSuccess'));
  }

  openBookmark(bookmark: Bookmark): void {
    console.log(`Opening bookmark with ID: ${bookmark.id}`);
    // Navigate to resume detail page
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