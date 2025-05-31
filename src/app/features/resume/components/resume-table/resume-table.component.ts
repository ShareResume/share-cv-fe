import { Component, EventEmitter, Output, inject, input } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { TableComponent } from '@app/reusable/table/table.component';
import { ChipsComponent } from '@app/reusable/chips/chips.component';
import { ButtonComponent } from '@app/reusable/button/button.component';
import { PublicResume } from '../../models/resume.model';
import { DatePipe } from '@angular/common';
import { effect, signal } from '@angular/core';
import { PageEvent } from '@angular/material/paginator';
import { Router } from '@angular/router';
import { ResumeStateService } from '../../services/resume-state.service';
import { TranslateModule, TranslateService } from '@ngx-translate/core';

interface ResumeTableItem extends PublicResume {
  statusObject: PublicResume; 
  companiesList: PublicResume;
}

@Component({
  selector: 'app-resume-table',
  templateUrl: './resume-table.component.html',
  styleUrl: './resume-table.component.scss',
  standalone: true,
  imports: [
    TableComponent,
    DatePipe,
    ChipsComponent,
    TranslateModule,
  ],
})
export class ResumeTableComponent {
  private router = inject(Router);
  private resumeStateService = inject(ResumeStateService);
  private translateService = inject(TranslateService);
  
  private enablePageEvents = signal<boolean>(false);

  resumes = input<PublicResume[]>([]);
  isLoading = input<boolean>(false);
  totalCount = input<number>(0);
  pageSize = input<number>(10);
  pageIndex = input<number>(0);
  
  @Output() pageChanged = new EventEmitter<PageEvent>();
  
  dataSource = new MatTableDataSource<ResumeTableItem>([]);
  
  displayedColumns: Record<string, string> = {
    companiesList: this.translateService.instant('table.columns.companies'),
    speciality: this.translateService.instant('table.columns.speciality'),
    yearsOfExperience: this.translateService.instant('table.columns.yearsOfExperience'),
    statusObject: this.translateService.instant('table.columns.status'),
    date: this.translateService.instant('table.columns.createdAt'),
  };

  constructor() {
    effect(() => {
      const data = this.resumes();
      console.log('[ResumeTableComponent] Updating data source with', data.length, 'items');
      
      this.dataSource.data = data.map(resume => {
        const item = Object.create(Object.getPrototypeOf(resume));
        
        Object.assign(item, resume);
        
        item.statusObject = resume;
        
        item.companiesList = resume;
        
        return item;
      });
      
      if (data.length > 0 && !this.enablePageEvents()) {
        console.log('[ResumeTableComponent] Data loaded, enabling page events after delay');
        setTimeout(() => {
          console.log('[ResumeTableComponent] Page events now enabled');
          this.enablePageEvents.set(true);
        }, 500);
      }
    });

    this.translateService.onLangChange.subscribe(() => {
      this.displayedColumns = {
        companiesList: this.translateService.instant('table.columns.companies'),
        speciality: this.translateService.instant('table.columns.speciality'),
        yearsOfExperience: this.translateService.instant('table.columns.yearsOfExperience'),
        statusObject: this.translateService.instant('table.columns.status'),
        date: this.translateService.instant('table.columns.createdAt'),
      };
    });
  }
  
  viewResume(resume: PublicResume): void {
    if (!resume) {
      console.error('Resume is undefined');
      return;
    }
    
    this.resumeStateService.setSelectedResume(resume);
    
    this.router.navigate(['/resumes', resume.id]);
  }
  
  onPageChange(event: PageEvent): void {
    if (!this.enablePageEvents()) {
      console.log('[ResumeTableComponent] Page events disabled, ignoring event');
      return;
    }
    
    const isRedundantEvent = 
      event.pageIndex === this.pageIndex() && 
      event.pageSize === this.pageSize();
      
    if (!isRedundantEvent) {
      console.log('[ResumeTableComponent] Emitting genuine page change:', event);
      this.pageChanged.emit(event);
    } else {
      console.log('[ResumeTableComponent] Skipping redundant page change');
    }
  }
  
  getStatusText(resume: PublicResume | null): string {
    if (!resume) {
      return this.translateService.instant('resume.na');
    }
    
    const counts = resume.getHrScreeningStatusCounts();
    return `Passed: ${counts.passed} / Rejected: ${counts.notPassed}`;
  }

  formatDate(date: Date | null): string {
    if (!date) return this.translateService.instant('resume.na');
    
    const options: Intl.DateTimeFormatOptions = { 
      year: 'numeric', 
      month: 'short', 
      day: 'numeric' 
    };
    
    return date.toLocaleDateString('en-US', options);
  }
}