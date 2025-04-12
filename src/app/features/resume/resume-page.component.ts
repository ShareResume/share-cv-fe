import { Component, DestroyRef, effect, inject, signal } from '@angular/core';
import { ResumeFilterComponent } from './components/resume-filter/resume-filter.component';
import { ResumeTableComponent } from './components/resume-table/resume-table.component';
import { ResumeService } from './services/resume.service';
import { Resume } from './models/resume.model';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { finalize } from 'rxjs';
import { ResumeFilters } from './models/resume-filters.model';

@Component({
  selector: 'app-resume-page',
  templateUrl: './resume-page.component.html',
  styleUrl: './resume-page.component.scss',
  standalone: true,
  imports: [ResumeFilterComponent, ResumeTableComponent],
})
export class ResumePageComponent {
  private resumeService = inject(ResumeService);
  private destroyRef = inject(DestroyRef);

  protected readonly Math = Math;

  resumes = signal<Resume[]>([]);
  totalCount = signal<number>(0);
  isLoading = signal<boolean>(false);
  error = signal<string | null>(null);
  
  // Current filters signal with default values
  filters = signal<ResumeFilters>({
    company: '',
    specialization: '',
    status: '',
    yearsOfExperience: {
      min: null,
      max: null,
    },
    date: '',
    page: 1,
    pageSize: 10,
    orderBy: 'Date',
    sortOrder: 'Descending',
  });
  
  constructor() {
    // Use effect to watch for filter changes and load resumes
    effect(() => {
      // The effect automatically tracks the filters signal
      const currentFilters = this.filters();

      this.loadResumes(currentFilters);
    });
  }
  
  // Handle filter events from filter component
  onFilterApplied(newFilters: ResumeFilters): void {
    // Update the filters signal with new values, preserving pagination
    this.filters.update(current => ({
      ...current,
      ...newFilters,
      // Reset to page 1 when filters change
      page: 1,
    }));
  }
  
  // Handle page change events from the table
  onPageChanged(pageEvent: { pageIndex: number, pageSize: number }): void {
    this.filters.update(current => ({
      ...current,
      page: pageEvent.pageIndex + 1, // Convert from 0-based to 1-based index
      pageSize: pageEvent.pageSize,
    }));
  }
  
  // Load resumes with filters
  private loadResumes(filters: ResumeFilters): void {
    this.isLoading.set(true);
    this.error.set(null);
    
    this.resumeService.getResumes(filters)
      .pipe(
        takeUntilDestroyed(this.destroyRef),
        finalize(() => this.isLoading.set(false)),
      )
      .subscribe({
        next: (response) => {
          this.resumes.set(response.data);
          this.totalCount.set(response.totalCount);
        },
        error: (err) => {
          console.error('Error loading resumes:', err);
          this.error.set('Failed to load resumes. Please try again later.');
        },
      });
  }
} 