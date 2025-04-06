import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DropdownComponent } from './dropdown.component';
import { By } from '@angular/platform-browser';
import { provideNoopAnimations } from '@angular/platform-browser/animations';
import { MatIconTestingModule } from '@angular/material/icon/testing';
import { Status } from '../models/dropdown.model';
import { Component } from '@angular/core';

@Component({
  template: `
    <app-dropdown 
      [options]="options" 
      [multiple]="multiple">
    </app-dropdown>
  `,
  standalone: true,
  imports: [DropdownComponent]
})
class TestHostComponent {
  options: Status[] = [];
  multiple = true;
}

describe('DropdownComponent Basic', () => {
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
  });

  it('should create', () => {
    fixture.detectChanges();
    expect(component).toBeTruthy();
  });

  it('should show options', () => {
    fixture.componentRef.setInput('options', testOptions);
    fixture.detectChanges();
    component.ngOnInit();

    fixture.debugElement.query(By.css('.dropdown')).nativeElement?.click();
    fixture.detectChanges();

    expect(fixture.debugElement.query(By.css('.custom')).nativeElement.innerText).toContain('Name')
  });
});

describe('DropdownComponent with multiple selection', () => {
  let hostComponent: TestHostComponent;
  let hostFixture: ComponentFixture<TestHostComponent>;
  let dropdownComponent: DropdownComponent;
  const testOptions: Status[] = [{
    value: 'ID',
    viewValue: 'Name',
  }];

  beforeEach(async() => {
    await TestBed.configureTestingModule({
      imports: [TestHostComponent, DropdownComponent, MatIconTestingModule],
      providers: [
        provideNoopAnimations(),
      ],
    })
    .compileComponents();

    hostFixture = TestBed.createComponent(TestHostComponent);
    hostComponent = hostFixture.componentInstance;
    hostComponent.options = testOptions;
    hostComponent.multiple = true;
    hostFixture.detectChanges();
    
    dropdownComponent = hostFixture.debugElement.query(
      By.directive(DropdownComponent)
    ).componentInstance;
  });

  it('should select option in multiple mode', () => {
    hostFixture.debugElement.query(By.css('.dropdown')).nativeElement?.click();
    hostFixture.detectChanges();

    hostFixture.debugElement.query(By.css('mat-option')).nativeElement?.click();
    hostFixture.detectChanges();

    expect(dropdownComponent.form?.get('status')?.value).toEqual(['ID']);
  });

  it('should show checkbox for multiple selection', () => {
    hostFixture.debugElement.query(By.css('.dropdown')).nativeElement?.click();
    hostFixture.detectChanges();

    expect(hostFixture.debugElement.query(By.css('.custom mat-pseudo-checkbox'))).toBeTruthy();
  });
});

describe('DropdownComponent with single selection', () => {
  let hostComponent: TestHostComponent;
  let hostFixture: ComponentFixture<TestHostComponent>;
  let dropdownComponent: DropdownComponent;
  const testOptions: Status[] = [{
    value: 'ID',
    viewValue: 'Name',
  }];

  beforeEach(async() => {
    await TestBed.configureTestingModule({
      imports: [TestHostComponent, DropdownComponent, MatIconTestingModule],
      providers: [
        provideNoopAnimations(),
      ],
    })
    .compileComponents();

    hostFixture = TestBed.createComponent(TestHostComponent);
    hostComponent = hostFixture.componentInstance;
    hostComponent.options = testOptions;
    hostComponent.multiple = false;
    hostFixture.detectChanges();
    
    dropdownComponent = hostFixture.debugElement.query(
      By.directive(DropdownComponent)
    ).componentInstance;
  });

  it('should select option in single mode', () => {
    hostFixture.debugElement.query(By.css('.dropdown')).nativeElement?.click();
    hostFixture.detectChanges();

    hostFixture.debugElement.query(By.css('mat-option')).nativeElement?.click();
    hostFixture.detectChanges();

    expect(dropdownComponent.form?.get('status')?.value).toEqual('ID');
  });

  it('should not show checkbox for single selection', () => {
    hostFixture.debugElement.query(By.css('.dropdown')).nativeElement?.click();
    hostFixture.detectChanges();

    // In single selection mode, the mat-pseudo-checkbox should not be displayed
    const pseudoCheckboxes = hostFixture.debugElement.queryAll(By.css('.mat-mdc-option:not(.mat-mdc-option-multiple) .mat-pseudo-checkbox'));
    expect(pseudoCheckboxes.length).toBe(0);
  });
});
