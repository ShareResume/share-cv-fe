import { Component, EventEmitter, Output, OnInit, input } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { InputComponent } from '@app/reusable/input/input.component';
import { ButtonComponent } from '@app/reusable/button/button.component';
import { CommonModule } from '@angular/common';
import { ResumeFilters } from '../../models/resume-filters.model';
import { DropdownComponent } from '@app/reusable/dropdown/dropdown.component';
import { Status } from '@app/reusable/models/dropdown.model';
import { SpecializationEnum } from '@app/core/enums/specialization.enum';
import { ResumeStatusEnum } from '@app/core/enums/resume-status.enum';

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
  readonly SPECIALIZATION_OPTIONS: Status[] = Object.keys(SpecializationEnum).map(key => ({
    value: SpecializationEnum[key as keyof typeof SpecializationEnum],
    viewValue: SpecializationEnum[key as keyof typeof SpecializationEnum]
  }));
  
  // Status options for dropdown
  readonly STATUS_OPTIONS: Status[] = Object.keys(ResumeStatusEnum).map(key => ({
    value: ResumeStatusEnum[key as keyof typeof ResumeStatusEnum],
    viewValue: ResumeStatusEnum[key as keyof typeof ResumeStatusEnum]
  }));
  
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
    
    // Create the filters object with basic structure
    const filters: ResumeFilters = {
      company: formValue.company || '',
      specialization: '',
      status: '',
      date: formValue.date || '',
      yearsOfExperience: {
        min: formValue.minYoe,
        max: formValue.maxYoe,
      }
    };
    
    // Set specialization value if it exists
    if (formValue.specialization) {
      if (typeof formValue.specialization === 'string' && formValue.specialization !== '') {
        filters.specialization = formValue.specialization;
      } else if (Array.isArray(formValue.specialization) && formValue.specialization.length) {
        filters.specialization = formValue.specialization[0];
      }
    }
    
    // Set status value if it exists
    if (formValue.status) {
      if (typeof formValue.status === 'string' && formValue.status !== '') {
        filters.status = formValue.status;
      } else if (Array.isArray(formValue.status) && formValue.status.length) {
        filters.status = formValue.status[0];
      }
    }
    
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