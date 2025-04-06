import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DropdownComponent } from './dropdown.component';
import { By } from '@angular/platform-browser';
import { provideNoopAnimations } from '@angular/platform-browser/animations';
import { MatIconTestingModule } from '@angular/material/icon/testing';
import { Status } from '../models/dropdown.model';

describe('DropdownComponent', () => {
  let component: DropdownComponent;
  let fixture: ComponentFixture<DropdownComponent>;
  const testOptions: Status[] = [{
    value: 'ID',
    viewValue: 'Name',
  }];

  beforeEach(async() => {
    await TestBed.configureTestingModule({
      imports: [DropdownComponent, MatIconTestingModule],
      providers: [
        provideNoopAnimations(),
      ],
    })
    .compileComponents();

    fixture = TestBed.createComponent(DropdownComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should show options', () => {
    fixture.componentRef.setInput('options', testOptions);
    component.ngOnInit();
    fixture.detectChanges();

    fixture.debugElement.query(By.css('.dropdown')).nativeElement?.click();
    fixture.detectChanges();

    expect(fixture.debugElement.query(By.css('.custom')).nativeElement.innerText).toContain('Name')
  });

  it('should select option in multiple mode', () => {
    fixture.componentRef.setInput('options', testOptions);
    fixture.componentRef.setInput('multiple', true);

    component.ngOnInit();
    fixture.detectChanges();

    fixture.debugElement.query(By.css('.dropdown')).nativeElement?.click();
    fixture.detectChanges();

    fixture.debugElement.query(By.css('mat-option')).nativeElement?.click();
    fixture.detectChanges();

    expect(component.form?.get('status')?.value).toEqual(['ID']);
  });

  it('should select option in single mode', () => {
    fixture.componentRef.setInput('options', testOptions);
    fixture.componentRef.setInput('multiple', false);

    component.ngOnInit();
    fixture.detectChanges();

    fixture.debugElement.query(By.css('.dropdown')).nativeElement?.click();
    fixture.detectChanges();

    fixture.debugElement.query(By.css('mat-option')).nativeElement?.click();
    fixture.detectChanges();

    expect(component.form?.get('status')?.value).toEqual('ID');
  });

  it('should show checkbox for multiple selection', () => {
    fixture.componentRef.setInput('options', testOptions);
    fixture.componentRef.setInput('multiple', true);

    component.ngOnInit();
    fixture.detectChanges();

    fixture.debugElement.query(By.css('.dropdown')).nativeElement?.click();
    fixture.detectChanges();

    expect(fixture.debugElement.query(By.css('.custom mat-pseudo-checkbox'))).toBeTruthy();
  });

  it('should not show checkbox for single selection', () => {
    fixture.componentRef.setInput('options', testOptions);
    fixture.componentRef.setInput('multiple', false);

    component.ngOnInit();
    fixture.detectChanges();

    fixture.debugElement.query(By.css('.dropdown')).nativeElement?.click();
    fixture.detectChanges();

    // In single selection mode, the mat-pseudo-checkbox should not be displayed
    const pseudoCheckboxes = fixture.debugElement.queryAll(By.css('.mat-mdc-option:not(.mat-mdc-option-multiple) .mat-pseudo-checkbox'));
    expect(pseudoCheckboxes.length).toBe(0);
  });
});
