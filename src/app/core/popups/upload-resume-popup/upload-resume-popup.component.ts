import { Component, DestroyRef, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule, FormBuilder, FormGroup, Validators, FormArray } from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';
import { InputComponent } from '../../../reusable/input/input.component';
import { DropdownComponent } from '../../../reusable/dropdown/dropdown.component';
import { Status } from '../../../reusable/models/dropdown.model';
import { SpecializationEnum } from '../../enums/specialization.enum';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { finalize } from 'rxjs';
import { ResumeStatusEnum } from '@app/core/enums/resume-status.enum';
import { CompanyAutocompleteComponent } from '@app/reusable/company-autocomplete/company-autocomplete.component';
import { Company } from '@app/core/models/company.model';
import { UserResumesService } from '@app/features/resume/services/user-resumes.service';
import { ResumeFormData, CompanyStatusInfo } from '@app/features/resume/models/resume-form-data';
import { IconComponent } from '@app/reusable/icon/icon.component';
import { ButtonComponent } from '@app/reusable/button/button.component';
import { ToasterService } from '@app/core/services/toaster.service';

interface CompanyStatus {
  company: Company | null;
  status: string;
}

@Component({
  selector: 'app-upload-resume-popup',
  templateUrl: './upload-resume-popup.component.html',
  styleUrls: ['./upload-resume-popup.component.scss'],
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    InputComponent,
    DropdownComponent,
    CompanyAutocompleteComponent,
    IconComponent,
    ButtonComponent
  ]
})
export class UploadResumePopupComponent implements OnInit {
  private dialogRef = inject(MatDialogRef<UploadResumePopupComponent>);
  private fb = inject(FormBuilder);
  private usersResumeService = inject(UserResumesService);
  private destroyRef = inject(DestroyRef);
  private toasterService = inject(ToasterService);

  resumeForm!: FormGroup;
  statusOptions: Status[] = [];
  specializationOptions: Status[] = [];
  selectedFile: File | null = null;
  isSubmitting = false;
  
  ResumeStatusEnum = ResumeStatusEnum;
  SpecializationEnum = SpecializationEnum;

  ngOnInit(): void {
    this.initForm();
    this.loadStatusOptions();
    this.loadSpecializationOptions();
  }

  private initForm(): void {
    this.resumeForm = this.fb.group({
      companiesData: this.fb.array([
        this.createCompanyStatusGroup()
      ]),
      yearsOfExperience: ['', [Validators.required, Validators.min(0)]],
      specialization: ['', Validators.required]
    });
  }

  private createCompanyStatusGroup(): FormGroup {
    return this.fb.group({
      company: [null, Validators.required],
      status: ['', Validators.required]
    });
  }

  get companiesArray(): FormArray {
    return this.resumeForm.get('companiesData') as FormArray;
  }

  addCompany(): void {
    this.companiesArray.push(this.createCompanyStatusGroup());
  }

  removeCompany(index: number): void {
    if (this.companiesArray.length > 1) {
      this.companiesArray.removeAt(index);
    }
  }

  private loadStatusOptions(): void {
    this.statusOptions = Object.keys(ResumeStatusEnum).map(key => ({
      value: ResumeStatusEnum[key as keyof typeof ResumeStatusEnum],
      viewValue: ResumeStatusEnum[key as keyof typeof ResumeStatusEnum]
    }));
  }

  private loadSpecializationOptions(): void {
    this.specializationOptions = Object.keys(SpecializationEnum).map(key => ({
      value: SpecializationEnum[key as keyof typeof SpecializationEnum],
      viewValue: SpecializationEnum[key as keyof typeof SpecializationEnum]
    }));
  }

  onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      this.selectedFile = input.files[0];
    }
  }

  onSubmit(): void {
    if (this.resumeForm.valid && this.selectedFile) {
      this.isSubmitting = true;
      
      const formValues = this.resumeForm.value;
      const companiesData = formValues.companiesData as CompanyStatus[];
      
      // Map company data to the format expected by the service
      const companiesInfo: CompanyStatusInfo[] = companiesData.map(item => ({
        companyId: item.company!.id,
        status: item.status
      }));
      
      const formData: ResumeFormData = {
        companies: companiesInfo,
        yearsOfExperience: formValues.yearsOfExperience,
        specialization: formValues.specialization,
        file: this.selectedFile
      };
      
      this.usersResumeService.addResume(formData)
        .pipe(
          takeUntilDestroyed(this.destroyRef),
          finalize(() => this.isSubmitting = false)
        )
        .subscribe({
          next: (response) => {
            this.toasterService.showSuccess('Resume uploaded successfully');
            this.dialogRef.close(response);
          },
          error: (error) => {
            console.error('Error submitting resume:', error);
          }
        });
    } else {
      this.resumeForm.markAllAsTouched();
    }
  }

  onCancel(): void {
    this.dialogRef.close();
  }

  removeFile(): void {
    this.selectedFile = null;
  }
} 