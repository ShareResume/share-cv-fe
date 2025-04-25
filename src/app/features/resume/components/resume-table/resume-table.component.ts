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

@Component({
  selector: 'app-resume-table',
  templateUrl: './resume-table.component.html',
  styleUrl: './resume-table.component.scss',
  standalone: true,
  imports: [
    TableComponent,
    ChipsComponent,
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
  dataSource = new MatTableDataSource<Resume>([]);
  
  // Table columns configuration
  displayedColumns: Record<string, string> = {
    company: 'Company',
    speciality: 'Specialization',
    yearsOfExperience: 'Years of Experience',
    status: 'Status',
    timestamp: 'Date',
  };

  constructor() {
    // Set up effect to update the data source when resumes change
    effect(() => {
      const data = this.resumes();
      console.log('[ResumeTableComponent] Updating data source with', data.length, 'items');
      this.dataSource.data = data;
      
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
}