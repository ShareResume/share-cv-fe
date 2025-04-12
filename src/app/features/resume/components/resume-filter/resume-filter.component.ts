import { Component, EventEmitter, Output, OnInit, input } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { InputComponent } from '@app/reusable/input/input.component';
import { ButtonComponent } from '@app/reusable/button/button.component';
import { CommonModule } from '@angular/common';
import { ResumeFilters } from '../../models/resume-filters.model';
import { DropdownComponent } from '@app/reusable/dropdown/dropdown.component';
import { Status } from '@app/reusable/models/dropdown.model';

@Component({
  selector: 'app-resume-filter',
  templateUrl: './resume-filter.component.html',
  styleUrl: './resume-filter.component.scss',
  standalone: true,
  imports: [
    InputComponent, 
    ButtonComponent, 
    ReactiveFormsModule, 
    CommonModule, 
    DropdownComponent,
  ],
})
export class ResumeFilterComponent implements OnInit {
  @Output() filterApplied = new EventEmitter<ResumeFilters>();
  
  // Input for existing filters - allows parent to pass down current filters
  currentFilters = input<ResumeFilters>({
    company: '',
    specialization: '',
    status: '',
    yearsOfExperience: {
      min: null,
      max: null,
    },
    date: '',
  });
  
  // Specialization options for dropdown
  // TODO: Get from backend or SpecializationEnum
  readonly SPECIALIZATION_OPTIONS: Status[] = [
    {
 viewValue: 'Frontend', value: 'Frontend', 
},
    {
 viewValue: 'Backend', value: 'Backend', 
},
    {
 viewValue: 'Full Stack', value: 'Full Stack', 
},
    {
 viewValue: 'DevOps', value: 'DevOps', 
},
    {
 viewValue: 'QA', value: 'QA', 
},
    {
 viewValue: 'UI/UX', value: 'UI/UX', 
},
  ];
  
  // Status options for dropdown
  // TODO: Get from backend
  readonly STATUS_OPTIONS: Status[] = [
    {
 viewValue: 'Active', value: 'Active', 
},
    {
 viewValue: 'Pending', value: 'Pending', 
},
    {
 viewValue: 'Approved', value: 'Approved', 
},
    {
 viewValue: 'Rejected', value: 'Rejected', 
},
  ];
  
  // Form group for all filters
  filterForm = new FormGroup({
    company: new FormControl(''),
    specialization: new FormControl<string | string[] | null>(null),
    status: new FormControl<string | string[] | null>(null),
    minYoe: new FormControl<number | null>(null),
    maxYoe: new FormControl<number | null>(null),
    date: new FormControl(''),
  });
  
  ngOnInit(): void {
    // Initialize form with current filters from input
    const filters = this.currentFilters();
    
    this.filterForm.setValue({
      company: filters.company || '',
      specialization: filters.specialization || null,
      status: filters.status || null,
      minYoe: filters.yearsOfExperience?.min || null,
      maxYoe: filters.yearsOfExperience?.max || null,
      date: filters.date || '',
    }, { emitEvent: false });
  }
  
  // Apply filters
  applyFilters(): void {
    const formValue = this.filterForm.value;
    
    // Create the filters object
    const filters: ResumeFilters = {
      company: formValue.company || '',
      specialization: typeof formValue.specialization === 'string' ? formValue.specialization 
                    : (Array.isArray(formValue.specialization) && formValue.specialization.length 
                     ? formValue.specialization[0] : ''),
      status: typeof formValue.status === 'string' ? formValue.status 
             : (Array.isArray(formValue.status) && formValue.status.length 
              ? formValue.status[0] : ''),
      yearsOfExperience: {
        min: formValue.minYoe,
        max: formValue.maxYoe,
      },
      date: formValue.date || '',
    };
    
    // Remove empty properties
    Object.keys(filters).forEach(key => {
      if (filters[key as keyof ResumeFilters] === '') {
        delete filters[key as keyof ResumeFilters];
      }
    });
    
    // If yearsOfExperience has no values, remove it
    if (filters.yearsOfExperience 
        && filters.yearsOfExperience.min === null 
        && filters.yearsOfExperience.max === null) {
      delete filters.yearsOfExperience;
    }
    
    this.filterApplied.emit(filters);
  }
  
  // Reset the form
  resetFilters(): void {
    this.filterForm.reset({
      company: '',
      specialization: null,
      status: null,
      minYoe: null,
      maxYoe: null, 
      date: '',
    });
    
    this.applyFilters();
  }
} 