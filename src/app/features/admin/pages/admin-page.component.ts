import { Component, DestroyRef, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatTableDataSource } from '@angular/material/table';
import { PageEvent } from '@angular/material/paginator';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { AdminTableComponent } from '../components/admin-table/admin-table.component';
import { UserResumesService } from '@app/features/resume/services/user-resumes.service';
import { PrivateResume, Resume } from '@app/features/resume/models/resume.model';
import { finalize } from 'rxjs';
import { ToasterService } from '@app/core/services/toaster.service';

@Component({
  selector: 'app-admin-page',
  templateUrl: './admin-page.component.html',
  styleUrl: './admin-page.component.scss',
  standalone: true,
  imports: [
    CommonModule,
    AdminTableComponent
  ]
})
export class AdminPageComponent implements OnInit {
  private resumesService = inject(UserResumesService);
  private destroyRef = inject(DestroyRef);
  private toasterService = inject(ToasterService);

  resumes: PrivateResume[] = [];
  dataSource = new MatTableDataSource<PrivateResume>([]);
  isLoading = false;
  totalCount = 0;
  pageSize = 10;
  pageIndex = 0;

  ngOnInit(): void {
    this.loadResumes();
  }

  loadResumes(): void {
    this.isLoading = true;
    
    this.resumesService.getResumes()
      .pipe(
        takeUntilDestroyed(this.destroyRef),
        finalize(() => this.isLoading = false)
      )
      .subscribe({
        next: (data) => {
          try {
            // Store both the raw data and properly instantiated objects
            console.log('Raw resume data:', data);
            
            // Convert the raw JSON to proper PrivateResume instances
            this.resumes = Array.isArray(data) ? data.map(item => {
              // Be sure we're working with the Resume.fromJson method
              const resume = Resume.fromJson(item);
              console.log('Converted resume:', resume);
              return resume instanceof PrivateResume ? resume : PrivateResume.fromJson(item);
            }) : [];
            
            console.log('Processed resumes:', this.resumes);
            this.totalCount = this.resumes.length;
          } catch (err) {
            console.error('Error processing resume data:', err);
            this.toasterService.showError('Error processing resume data');
          }
        },
        error: (error) => {
          console.error('Error loading resumes:', error);
          this.toasterService.showError('Failed to load resumes');
        }
      });
  }

  onPageChange(event: PageEvent): void {
    this.pageIndex = event.pageIndex;
    this.pageSize = event.pageSize;
    // For server-side pagination, you would reload data here
    // For now, we're using client-side pagination handled by the table component
  }
} 