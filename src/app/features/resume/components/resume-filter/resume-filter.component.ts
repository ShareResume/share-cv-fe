import { Component, EventEmitter, Output, OnInit, input } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { InputComponent } from '@app/reusable/input/input.component';
import { ButtonComponent } from '@app/reusable/button/button.component';
import { CommonModule } from '@angular/common';
import { ResumeFilters } from '../../models/resume-filters.model';
import { DropdownComponent } from '@app/reusable/dropdown/dropdown.component';
import { Status } from '@app/reusable/models/dropdown.model';
import { SpecializationEnum } from '@app/core/enums/specialization.enum';
import { CompanyAutocompleteComponent } from '@app/reusable/company-autocomplete/company-autocomplete.component';
import { Company } from '@app/core/models/company.model';

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
    CompanyAutocompleteComponent,
  ],
})
export class ResumeFilterComponent implements OnInit {
  @Output() filterApplied = new EventEmitter<ResumeFilters>();
  
  // Input for existing filters - allows parent to pass down current filters
  currentFilters = input<ResumeFilters>({
    companyId: '',
    speciality: '',
    isHrScreeningPassed: null,
    yearOfExperienceRange: {
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
  
  // Status options for boolean dropdown
  readonly HR_SCREENING_OPTIONS: Status[] = [
    { value: 'true', viewValue: 'Passed' },
    { value: 'false', viewValue: 'Not Passed' }
  ];
  
  // Form group for all filters
  filterForm = new FormGroup({
    company: new FormControl<Company | null>(null),
    speciality: new FormControl<string | string[] | null>(null),
    isHrScreeningPassed: new FormControl<string | null>(null),
    minYoe: new FormControl<number | null>(null),
    maxYoe: new FormControl<number | null>(null),
    date: new FormControl(''),
  });
  
  ngOnInit(): void {
    // Initialize form with current filters from input
    const filters = this.currentFilters();
    
    this.filterForm.setValue({
      company: filters.company || null,
      speciality: filters.speciality || null,
      isHrScreeningPassed: filters.isHrScreeningPassed !== null ? String(filters.isHrScreeningPassed) : null,
      minYoe: filters.yearOfExperienceRange?.min || null,
      maxYoe: filters.yearOfExperienceRange?.max || null,
      date: filters.date || '',
    }, { emitEvent: false });
  }
  
  // Apply filters
  applyFilters(): void {
    const formValue = this.filterForm.value;
    
    // Create the filters object with basic structure
    const filters: ResumeFilters = {
      companyId: formValue.company ? (formValue.company as Company).id : '',
      speciality: '',
      isHrScreeningPassed: null,
      date: formValue.date || '',
      yearOfExperienceRange: {
        min: formValue.minYoe,
        max: formValue.maxYoe,
      }
    };
    
    // Set speciality value if it exists
    if (formValue.speciality) {
      if (typeof formValue.speciality === 'string' && formValue.speciality !== '') {
        filters.speciality = formValue.speciality;
      } else if (Array.isArray(formValue.speciality) && formValue.speciality.length) {
        filters.speciality = formValue.speciality[0];
      }
    }
    
    // Set isHrScreeningPassed value if it exists
    if (formValue.isHrScreeningPassed !== null) {
      filters.isHrScreeningPassed = formValue.isHrScreeningPassed === 'true';
    }
    
    // If yearOfExperienceRange has no values, remove it
    if (filters.yearOfExperienceRange 
        && filters.yearOfExperienceRange.min === null 
        && filters.yearOfExperienceRange.max === null) {
      delete filters.yearOfExperienceRange;
    }
    
    this.filterApplied.emit(filters);
  }
  
  // Reset the form
  resetFilters(): void {
    this.filterForm.reset({
      company: null,
      speciality: null,
      isHrScreeningPassed: null,
      minYoe: null,
      maxYoe: null, 
      date: '',
    });
    
    this.applyFilters();
  }
} 