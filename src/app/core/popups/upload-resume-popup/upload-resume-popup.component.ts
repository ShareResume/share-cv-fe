import { Component, DestroyRef, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';
import { InputComponent } from '../../../reusable/input/input.component';
import { DropdownComponent } from '../../../reusable/dropdown/dropdown.component';
import { Status } from '../../../reusable/models/dropdown.model';
import { SpecializationEnum } from '../../enums/specialization.enum';
import { ResumeService, ResumeFormData } from '../../../features/resume/services/resume.service';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { finalize } from 'rxjs';
import { ResumeStatusEnum } from '@app/core/enums/resume-status.enum';

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
    DropdownComponent
  ]
})
export class UploadResumePopupComponent implements OnInit {
  private dialogRef = inject(MatDialogRef<UploadResumePopupComponent>);
  private fb = inject(FormBuilder);
  private resumeService = inject(ResumeService);
  private destroyRef = inject(DestroyRef);

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
      companyName: ['', Validators.required],
      yearsOfExperience: ['', [Validators.required, Validators.min(0)]],
      status: ['', Validators.required],
      specialization: ['', Validators.required]
    });
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
      
      const formData: ResumeFormData = {
        ...this.resumeForm.value,
        file: this.selectedFile
      };
      
      this.resumeService.addResume(formData)
        .pipe(
          takeUntilDestroyed(this.destroyRef),
          finalize(() => this.isSubmitting = false)
        )
        .subscribe({
          next: (response) => {
            this.dialogRef.close(response);
          },
          error: (error) => {
            console.error('Error submitting resume:', error);
            // You could add error handling here, such as displaying an error message
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