import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ButtonComponent } from './button.component';
import { NO_ERRORS_SCHEMA } from '@angular/core';

describe('ButtonComponent', () => {
  let component: ButtonComponent;
  let fixture: ComponentFixture<ButtonComponent>;

  beforeEach(async() => {
    await TestBed.configureTestingModule({
      imports: [ButtonComponent],
      schemas: [NO_ERRORS_SCHEMA], // Ignore unknown elements
    }).compileComponents();

    fixture = TestBed.createComponent(ButtonComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should have default values for inputs', () => {
    expect(component.size()).toEqual('medium');
    expect(component.colorType()).toEqual('primary');
    expect(component.isLink()).not.toBeTruthy();
    expect(component.disabled()).not.toBeTruthy();
  });

  it('should compute buttonClass correctly based on inputs', () => {
    fixture.componentRef.setInput('size', 'small');
    fixture.componentRef.setInput('colorType', 'terniary');
    fixture.detectChanges();

    expect(component.buttonClass).toEqual(
      'btn btn--terniary btn--small btn--terniary--small btn--weight--medium',
    );
  });

  it('should apply disabled attribute correctly', () => {
    fixture.componentRef.setInput('disabled', true);
    fixture.detectChanges();

    const buttonElement: HTMLButtonElement
      = fixture.nativeElement.querySelector('button');

    expect(buttonElement.disabled).toBeTruthy();
  });

  it('should set the button type based on isLink input', () => {
    fixture.componentRef.setInput('isLink', false);
    fixture.detectChanges();

    let buttonElement: HTMLButtonElement
      = fixture.nativeElement.querySelector('button');

    expect(buttonElement.getAttribute('type')).toBe('submit');

    fixture.componentRef.setInput('isLink', true);
    fixture.detectChanges();
    buttonElement = fixture.nativeElement.querySelector('button');
    expect(buttonElement.getAttribute('type')).toBe('button');
  });

  it('should render ng-content', () => {
    const content = 'Click Me';

    fixture.componentRef.setInput('isLink', false);
    fixture.detectChanges();

    const buttonElement: HTMLElement
      = fixture.nativeElement.querySelector('button');

    buttonElement.innerHTML = content;
    expect(buttonElement.innerHTML).toContain(content);
  });
});
