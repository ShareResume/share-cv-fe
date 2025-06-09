import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { PopupComponent, PopupData } from './popup.component';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { PopupContentComponent } from './popup-content.component';
import { TranslateModule, TranslateService } from '@ngx-translate/core';

describe('PopupComponent', () => {
  let component: PopupComponent;
  let fixture: ComponentFixture<PopupComponent>;
  let dialogRef: jasmine.SpyObj<MatDialogRef<PopupComponent>>;

  const mockDialogRef = {
    close: jasmine.createSpy('close')
  };

  const mockDialogData: PopupData = {
    title: 'Test Title',
    buttons: [
      { label: 'Save', type: 'primary', action: 'save' },
      { label: 'Cancel', type: 'secondary' }
    ],
    content: 'Test content'
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        PopupComponent,
        MatDialogModule,
        NoopAnimationsModule,
        PopupContentComponent,
        TranslateModule.forRoot(),

      ],
      providers: [
        TranslateService,
        { provide: MatDialogRef, useValue: mockDialogRef },
        { provide: MAT_DIALOG_DATA, useValue: mockDialogData }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(PopupComponent);
    component = fixture.componentInstance;
    dialogRef = TestBed.inject(MatDialogRef) as jasmine.SpyObj<MatDialogRef<PopupComponent>>;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should display the title from provided data', () => {
    const titleElement = fixture.debugElement.query(By.css('.popup__title'));
    expect(titleElement.nativeElement.textContent).toContain('Test Title');
  });

  it('should close the dialog when close button is clicked', () => {
    const closeButton = fixture.debugElement.query(By.css('.popup__close'));
    closeButton.triggerEventHandler('click', null);
    expect(mockDialogRef.close).toHaveBeenCalled();
  });

  it('should render buttons from provided data', () => {
    const buttonElements = fixture.debugElement.queryAll(By.css('.popup__footer button'));
    expect(buttonElements.length).toBe(2);
    expect(buttonElements[0].nativeElement.textContent.trim()).toBe('Save');
    expect(buttonElements[1].nativeElement.textContent.trim()).toBe('Cancel');
  });

  it('should close dialog with action value when button is clicked', () => {
    const buttonElements = fixture.debugElement.queryAll(By.css('.popup__footer button'));
    buttonElements[0].triggerEventHandler('click', null);
    expect(mockDialogRef.close).toHaveBeenCalledWith('save');
  });

  it('should close dialog with label when action is not provided', () => {
    const buttonElements = fixture.debugElement.queryAll(By.css('.popup__footer button'));
    buttonElements[1].triggerEventHandler('click', null);
    expect(mockDialogRef.close).toHaveBeenCalledWith('Cancel');
  });
}); 