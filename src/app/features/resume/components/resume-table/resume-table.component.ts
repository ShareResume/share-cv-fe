import { Component, EventEmitter, Output, inject, input } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { TableComponent } from '@app/reusable/table/table.component';
import { ChipsComponent } from '@app/reusable/chips/chips.component';
import { ButtonComponent } from '@app/reusable/button/button.component';
import { Resume } from '../../models/resume.model';
import { DatePipe } from '@angular/common';
import { effect, signal } from '@angular/core';
import { PageEvent } from '@angular/material/paginator';
import { Router } from '@angular/router';
import { ResumeStateService } from '../../services/resume-state.service';

interface ResumeTableItem extends Resume {
  statusObject: Resume; 
}

@Component({
  selector: 'app-resume-table',
  templateUrl: './resume-table.component.html',
  styleUrl: './resume-table.component.scss',
  standalone: true,
  imports: [
    TableComponent,
    DatePipe,
  ],
})
export class ResumeTableComponent {
  private router = inject(Router);
  private resumeStateService = inject(ResumeStateService);
  
  // Signal to track if we should process page events
  private enablePageEvents = signal<boolean>(false);

  // Accept signal values from parent component
  resumes = input<Resume[]>([]);
  isLoading = input<boolean>(false);
  totalCount = input<number>(0);
  pageSize = input<number>(10);
  pageIndex = input<number>(0);
  
  @Output() pageChanged = new EventEmitter<PageEvent>();
  
  // Table data source as a regular property, not a computed signal
  dataSource = new MatTableDataSource<ResumeTableItem>([]);
  
  // Table columns configuration
  displayedColumns: Record<string, string> = {
    company: 'Company',
    speciality: 'Specialization',
    yearsOfExperience: 'Years of Experience',
    statusObject: 'Status',
    date: 'Date',
  };

  constructor() {
    // Set up effect to update the data source when resumes change
    effect(() => {
      const data = this.resumes();
      console.log('[ResumeTableComponent] Updating data source with', data.length, 'items');
      
      // Create proper ResumeTableItem objects
      this.dataSource.data = data.map(resume => {
        // Create a new object that has all Resume properties and methods
        const item = Object.create(Object.getPrototypeOf(resume));
        
        // Copy all properties from the original resume
        Object.assign(item, resume);
        
        // Add the statusObject property
        item.statusObject = resume;
        
        return item;
      });
      
      // Wait for all data to be loaded and allow a little delay
      // before enabling page events to avoid initialization loop
      if (data.length > 0 && !this.enablePageEvents()) {
        console.log('[ResumeTableComponent] Data loaded, enabling page events after delay');
        setTimeout(() => {
          console.log('[ResumeTableComponent] Page events now enabled');
          this.enablePageEvents.set(true);
        }, 500);
      }
    });
  }
  
  viewResume(resume: Resume): void {
    // Add null check to prevent errors
    if (!resume) {
      console.error('Resume is undefined');
      return;
    }
    
    // Store the selected resume in the shared service
    this.resumeStateService.setSelectedResume(resume);
    
    // Navigate to the detail page
    this.router.navigate(['/resumes', resume.id]);
  }
  
  onPageChange(event: PageEvent): void {
    // Completely block page change events during initialization
    if (!this.enablePageEvents()) {
      console.log('[ResumeTableComponent] Page events disabled, ignoring event');
      return;
    }
    
    // Additional check to prevent redundant events
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
  
  /**
   * Get the status display text for a resume
   */
  getStatusText(resume: Resume | null): string {
    if (!resume) {
      return 'N/A';
    }
    
    const counts = resume.getHrScreeningStatusCounts();
    return `Passed: ${counts.passed} / Not passed: ${counts.notPassed}`;
  }
}