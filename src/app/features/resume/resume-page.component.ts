import { Component, DestroyRef, inject, OnInit, signal } from '@angular/core';
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
export class ResumePageComponent implements OnInit {
  private resumeService = inject(ResumeService);
  private destroyRef = inject(DestroyRef);
  private initialLoadComplete = false;
  private lastLoadedFilters: string = '';

  protected readonly Math = Math;

  // Use signals instead of standard variables for reactivity
  resumes = signal<Resume[]>([]);
  totalCount = signal<number>(0);
  isLoading = signal<boolean>(false);
  error = signal<string | null>(null);
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
  
  ngOnInit(): void {
    // Load resumes just once during initialization
    console.log('[ResumePageComponent] Initial load');
    this.loadResumes(this.filters());
  }
  
  // Handle filter events from filter component
  onFilterApplied(newFilters: ResumeFilters): void {
    console.log('[ResumePageComponent] Filters applied', newFilters);
    
    // Update filters, preserving pagination and resetting to page 1
    this.filters.update(currentFilters => ({
      ...currentFilters,
      ...newFilters,
      page: 1,
    }));
    
    // Load resumes with updated filters
    this.loadResumes(this.filters());
  }
  
  // Handle page change events from the table
  onPageChanged(pageEvent: { pageIndex: number, pageSize: number }): void {
    console.log('[ResumePageComponent] Page changed', pageEvent);
    
    // Prevent initial load from triggering duplicate API calls
    if (!this.initialLoadComplete) {
      console.log('[ResumePageComponent] Skipping page change during initial load');
      return;
    }
    
    const currentFilters = this.filters();
    
    // Skip API calls if this is the initial page rendering with default values
    // or if the page hasn't actually changed
    if ((pageEvent.pageIndex === 0 && pageEvent.pageSize === 10 && 
         currentFilters.page === 1 && currentFilters.pageSize === 10) ||
        (pageEvent.pageIndex + 1 === currentFilters.page && 
         pageEvent.pageSize === currentFilters.pageSize)) {
      console.log('[ResumePageComponent] Skipping redundant page change');
      return;
    }
    
    // Update filters with new pagination using signal update
    this.filters.update(currentFilters => ({
      ...currentFilters,
      page: pageEvent.pageIndex + 1, // Convert from 0-based to 1-based index
      pageSize: pageEvent.pageSize,
    }));
    
    // Load resumes with updated filters after page change
    this.loadResumes(this.filters());
  }
  
  // Load resumes with filters
  private loadResumes(filters: ResumeFilters): void {
    // Don't proceed if we're already loading
    if (this.isLoading()) {
      console.log('[ResumePageComponent] Skipping load - already loading');
      return;
    }
    
    // Create string representation of filters to check for duplicates
    const filtersString = JSON.stringify(filters);
    
    // Skip duplicate API calls for the same filters
    if (this.initialLoadComplete && filtersString === this.lastLoadedFilters) {
      console.log('[ResumePageComponent] Skipping load - filters unchanged');
      return;
    }
    
    console.log('[ResumePageComponent] Loading resumes with filters', filters);
    this.isLoading.set(true);
    this.error.set(null);
    
    // Update last loaded filters
    this.lastLoadedFilters = filtersString;
    
    this.resumeService.getResumes(filters)
      .pipe(
        takeUntilDestroyed(this.destroyRef),
        finalize(() => {
          console.log('[ResumePageComponent] Loading complete');
          this.isLoading.set(false);
          this.initialLoadComplete = true;
        }),
      )
      .subscribe({
        next: (response) => {
          console.log('[ResumePageComponent] Got response', response);
          this.resumes.set(response.data);
          this.totalCount.set(response.totalCount);
        },
        error: (err) => {
          console.error('[ResumePageComponent] Error loading resumes:', err);
          this.error.set('Failed to load resumes. Please try again later.');
        },
      });
  }
}