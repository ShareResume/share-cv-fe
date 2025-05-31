import { Component, DestroyRef, inject, OnInit, signal } from '@angular/core';
import { ResumeFilterComponent } from './components/resume-filter/resume-filter.component';
import { ResumeTableComponent } from './components/resume-table/resume-table.component';
import { ResumeService } from './services/resume.service';
import { PublicResume, Resume } from './models/resume.model';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { finalize } from 'rxjs';
import { ResumeFilters } from './models/resume-filters.model';
import { TranslateModule, TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-resume-page',
  templateUrl: './resume-page.component.html',
  styleUrl: './resume-page.component.scss',
  standalone: true,
  imports: [ResumeFilterComponent, ResumeTableComponent, TranslateModule],
})
export class ResumePageComponent implements OnInit {
  private resumeService = inject(ResumeService);
  private destroyRef = inject(DestroyRef);
  private translateService = inject(TranslateService);
  private initialLoadComplete = false;
  private lastLoadedFilters: string = '';

  protected readonly Math = Math;

  resumes = signal<PublicResume[]>([]);
  totalCount = signal<number>(0);
  isLoading = signal<boolean>(false);
  error = signal<string | null>(null);
  filters = signal<ResumeFilters>({
    companyId: '',
    speciality: '',
    isHrScreeningPassed: null,
    yearOfExperienceRange: {
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
    console.log('[ResumePageComponent] Initial load');
    this.loadResumes(this.filters());
  }
  
  onFilterApplied(newFilters: ResumeFilters): void {
    console.log('[ResumePageComponent] Filters applied', newFilters);
    
    this.filters.update(currentFilters => ({
      ...currentFilters,
      ...newFilters,
      page: 1,
    }));
    
    this.loadResumes(this.filters());
  }
  
  onPageChanged(pageEvent: { pageIndex: number, pageSize: number }): void {
    console.log('[ResumePageComponent] Page changed', pageEvent);
    
    if (!this.initialLoadComplete) {
      console.log('[ResumePageComponent] Skipping page change during initial load');
      return;
    }
    
    const currentFilters = this.filters();
    
    if ((pageEvent.pageIndex === 0 && pageEvent.pageSize === 10 && 
         currentFilters.page === 1 && currentFilters.pageSize === 10) ||
        (pageEvent.pageIndex + 1 === currentFilters.page && 
         pageEvent.pageSize === currentFilters.pageSize)) {
      console.log('[ResumePageComponent] Skipping redundant page change');
      return;
    }
    
    this.filters.update(currentFilters => ({
      ...currentFilters,
      page: pageEvent.pageIndex + 1,
      pageSize: pageEvent.pageSize,
    }));
    
    this.loadResumes(this.filters());
  }
  
  private loadResumes(filters: ResumeFilters): void {
    if (this.isLoading()) {
      console.log('[ResumePageComponent] Skipping load - already loading');
      return;
    }
    
    const filtersString = JSON.stringify(filters);
    
    if (this.initialLoadComplete && filtersString === this.lastLoadedFilters) {
      console.log('[ResumePageComponent] Skipping load - filters unchanged');
      return;
    }
    
    console.log('[ResumePageComponent] Loading resumes with filters', filters);
    this.isLoading.set(true);
    this.error.set(null);
    
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
          this.error.set(this.translateService.instant('resume.loadError'));
        },
      });
  }
}