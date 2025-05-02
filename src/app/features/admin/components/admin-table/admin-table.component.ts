import { Component, EventEmitter, Output, input } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { MatTableDataSource } from '@angular/material/table';
import { TableComponent } from '@app/reusable/table/table.component';
import { ButtonComponent } from '@app/reusable/button/button.component';
import { ChipsComponent } from '@app/reusable/chips/chips.component';
import { PrivateResume, Resume, ResumeStatusEnum } from '@app/features/resume/models/resume.model';
import { PageEvent } from '@angular/material/paginator';
import { Router } from '@angular/router';
import { IconComponent } from '@app/reusable/icon/icon.component';
import { AdminResumeStateService } from '../../services/admin-resume-state.service';

interface AdminTableItem extends PrivateResume {
  statusObject: PrivateResume;
}

@Component({
  selector: 'app-admin-table',
  templateUrl: './admin-table.component.html',
  styleUrl: './admin-table.component.scss',
  standalone: true,
  imports: [
    CommonModule,
    TableComponent,
    ButtonComponent,
    ChipsComponent,
    DatePipe,
    IconComponent
  ]
})
export class AdminTableComponent {
  // Input signals from parent component
  resumes = input<PrivateResume[]>([]);
  isLoading = input<boolean>(false);
  totalCount = input<number>(0);
  pageSize = input<number>(10);
  pageIndex = input<number>(0);
  
  @Output() pageChanged = new EventEmitter<PageEvent>();
  
  // Table data source
  dataSource = new MatTableDataSource<AdminTableItem>([]);
  
  // Table columns configuration
  displayedColumns: Record<string, string> = {
    id: 'ID',
    speciality: 'Specialization',
    yearsOfExperience: 'Experience (Years)',
    resumeStatus: 'Status',
    createdAt: 'Created Date',
    companies: 'Companies',
    documents: 'Documents',
    actions: '',
  };

  constructor(
    private router: Router,
    private adminResumeStateService: AdminResumeStateService
  ) {
    // Set up effect to update data source when resumes change
    this.setupResumeEffect();
  }
  
  private setupResumeEffect(): void {
    // Detect changes to resumes input
    const resumesSignal = this.resumes;
    if (resumesSignal) {
      // Manually react to resume changes
      this.updateDataSource(resumesSignal());
    }
  }
  
  private updateDataSource(resumes: PrivateResume[] | any[]): void {
    if (!resumes) return;
    
    // Create admin table items from resumes
    this.dataSource.data = resumes.map(resumeData => {
      // Convert raw JSON to PrivateResume instance if needed
      const resume = resumeData instanceof PrivateResume ? 
        resumeData : 
        PrivateResume.fromJson(resumeData);
      
      // Create admin table item with proper class instance
      const item = {
        ...resume,
        id: resume.id,
        speciality: resume.speciality,
        yearsOfExperience: resume.yearsOfExperience,
        resumeStatus: resume.resumeStatus,
        createdAt: resume.createdAt,
        companies: resume.companies,
        documents: resume.documents
      } as AdminTableItem;
      
      // Add the statusObject property for displaying status
      item.statusObject = resume;
      
      return item;
    });
  }
  
  ngOnChanges(): void {
    // React to input changes when resumes signal updates
    if (this.resumes()) {
      console.log('Resumes updated in admin-table:', this.resumes());
      this.updateDataSource(this.resumes());
    }
  }
  
  onPageChange(event: PageEvent): void {
    this.pageChanged.emit(event);
  }
  
  viewDocument(url: string | undefined | null): void {
    if (url) {
      window.open(url, '_blank');
    }
  }
  
  getStatusClass(status: ResumeStatusEnum): string {
    switch (status) {
      case ResumeStatusEnum.APPROVED:
        return 'status-approved';
      case ResumeStatusEnum.REJECTED:
        return 'status-rejected';
      case ResumeStatusEnum.WAITING_FOR_APPROVE:
        return 'status-waiting';
      default:
        return '';
    }
  }
  
  formatStatusText(status: ResumeStatusEnum): string {
    switch (status) {
      case ResumeStatusEnum.APPROVED:
        return 'Approved';
      case ResumeStatusEnum.REJECTED:
        return 'Rejected';
      case ResumeStatusEnum.WAITING_FOR_APPROVE:
        return 'Waiting for Approval';
      default:
        return status ? String(status) : '';
    }
  }
  
  getCompanyCount(companies: any[] | undefined): number {
    return companies?.length || 0;
  }
  
  getDocumentCount(documents: any[] | undefined): number {
    return documents?.length || 0;
  }
  
  /**
   * Get public document URL safely, whether from a class instance or a raw object
   */
  getPublicDocumentUrl(resume: any): string | null {
    // If it's a PrivateResume instance with the method
    if (resume && typeof resume.getPublicDocumentUrl === 'function') {
      return resume.getPublicDocumentUrl();
    }
    
    // Otherwise, try to extract from documents array
    if (resume && resume.documents && Array.isArray(resume.documents)) {
      const publicDoc = resume.documents.find((doc: any) => doc.accessType === 'PUBLIC');
      return publicDoc ? publicDoc.url : null;
    }
    
    return null;
  }

  getPublicDocumentUrlFromDocs(documents: any[] | undefined): string | null {
    if (!documents || !Array.isArray(documents)) {
      return null;
    }

    const publicDoc = documents.find(doc => doc.accessType === 'PUBLIC');
    return publicDoc ? publicDoc.url : null;
  }

  hasPublicDocument(documents: any[] | undefined): boolean {
    if (!documents || !Array.isArray(documents)) {
      return false;
    }
    
    return documents.some(doc => doc.accessType === 'PUBLIC');
  }

  viewResumeDetails(resume: any): void {
    console.log('Viewing resume details for:', resume);
    
    if (!resume || !resume.id) {
      console.error('Invalid resume object for details view', resume);
      return;
    }
    
    try {
      // Extract the value from the "statusObject" property if it exists
      // This is needed because the template might pass the entire row object
      const resumeData = resume.statusObject || resume;
      
      // Store the selected resume in the state service for access on the detail page
      if (resumeData instanceof PrivateResume) {
        console.log('Resume is a PrivateResume instance');
        this.adminResumeStateService.setSelectedResume(resumeData);
      } else {
        // Convert to PrivateResume instance if not already
        console.log('Converting to PrivateResume instance');
        const resumeInstance = PrivateResume.fromJson(resumeData);
        this.adminResumeStateService.setSelectedResume(resumeInstance);
      }
      
      // Navigate to the detail page
      console.log('Navigating to:', '/admin/resume/' + resumeData.id);
      this.router.navigate(['/admin/resume', resumeData.id]);
    } catch (error) {
      console.error('Error processing resume for details view', error);
    }
  }
}
