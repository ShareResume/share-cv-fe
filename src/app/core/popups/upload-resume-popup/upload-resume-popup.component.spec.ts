import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { UploadResumePopupComponent } from './upload-resume-popup.component';
import { Component } from '@angular/core';

// Create mock components for reusable components
@Component({
  selector: 'app-input',
  template: '',
  standalone: true
})
class MockInputComponent {}

@Component({
  selector: 'app-dropdown',
  template: '',
  standalone: true
})
class MockDropdownComponent {}

describe('UploadResumePopupComponent', () => {
  let component: UploadResumePopupComponent;
  let fixture: ComponentFixture<UploadResumePopupComponent>;
  let dialogRefSpy: jasmine.SpyObj<MatDialogRef<UploadResumePopupComponent>>;

  beforeEach(() => {
    dialogRefSpy = jasmine.createSpyObj('MatDialogRef', ['close']);

    TestBed.configureTestingModule({
      imports: [
        ReactiveFormsModule,
        HttpClientTestingModule,
        UploadResumePopupComponent,
        MockInputComponent,
        MockDropdownComponent
      ],
      providers: [
        { provide: MatDialogRef, useValue: dialogRefSpy }
      ]
    });

    fixture = TestBed.createComponent(UploadResumePopupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize the form with required fields', () => {
    expect(component.resumeForm).toBeDefined();
    expect(component.resumeForm.get('companyName')).toBeDefined();
    expect(component.resumeForm.get('position')).toBeDefined();
    expect(component.resumeForm.get('yearsOfExperience')).toBeDefined();
    expect(component.resumeForm.get('status')).toBeDefined();
    expect(component.resumeForm.get('specialization')).toBeDefined();
  });

  it('should close dialog when cancel is clicked', () => {
    component.onCancel();
    expect(dialogRefSpy.close).toHaveBeenCalled();
  });

  it('should not submit if form is invalid', () => {
    component.onSubmit();
    expect(dialogRefSpy.close).not.toHaveBeenCalled();
  });
}); 