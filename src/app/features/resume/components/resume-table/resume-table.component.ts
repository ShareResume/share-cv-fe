import { Component, EventEmitter, Output, inject, input } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { TableComponent } from '@app/reusable/table/table.component';
import { ChipsComponent } from '@app/reusable/chips/chips.component';
import { ButtonComponent } from '@app/reusable/button/button.component';
import { Resume } from '../../models/resume.model';
import { DatePipe } from '@angular/common';
import { effect } from '@angular/core';
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
    author: 'Author',
    company: 'Company',
    jobTitle: 'Job Title',
    status: 'Status',
    timestamp: 'Date',
    actions: 'Actions',
  };

  constructor() {
    // Set up effect to update the data source when resumes change
    effect(() => {
      this.dataSource.data = this.resumes();
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
    this.pageChanged.emit(event);
  }
} 