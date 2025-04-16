import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { PopupComponent } from './popup.component';

describe('PopupComponent', () => {
  let component: PopupComponent;
  let fixture: ComponentFixture<PopupComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PopupComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(PopupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should display the title', () => {
    // Access the input signal and update it through TestBed
    TestBed.runInInjectionContext(() => {
      component.title.update(value => 'Test Title');
    });
    fixture.detectChanges();

    // Check if title is rendered
    const titleElement = fixture.debugElement.query(By.css('.popup__title'));
    expect(titleElement.nativeElement.textContent).toContain('Test Title');
  });

  it('should emit close event when close button is clicked', () => {
    // Spy on the output
    const closeSpy = jest.spyOn(component.close, 'emit');
    
    // Trigger close button click
    const closeButton = fixture.debugElement.query(By.css('.popup__close'));
    closeButton.triggerEventHandler('click', null);
    
    // Verify the output was emitted
    expect(closeSpy).toHaveBeenCalled();
  });

  it('should render buttons when provided', () => {
    // Configure buttons
    const testButtons = [
      { label: 'Save', type: 'primary' as const, action: 'save' },
      { label: 'Cancel', type: 'secondary' as const }
    ];
    
    // Update input
    TestBed.runInInjectionContext(() => {
      component.buttons.update(() => testButtons);
    });
    fixture.detectChanges();
    
    // Check if buttons are rendered
    const buttonElements = fixture.debugElement.queryAll(By.css('.popup__footer button'));
    expect(buttonElements.length).toBe(2);
    expect(buttonElements[0].nativeElement.textContent.trim()).toBe('Save');
    expect(buttonElements[1].nativeElement.textContent.trim()).toBe('Cancel');
  });

  it('should emit buttonClick with action when button is clicked', () => {
    // Configure buttons
    const testButtons = [
      { label: 'Save', type: 'primary' as const, action: 'save' }
    ];
    
    // Update input
    TestBed.runInInjectionContext(() => {
      component.buttons.update(() => testButtons);
    });
    fixture.detectChanges();
    
    // Spy on the output
    const buttonClickSpy = jest.spyOn(component.buttonClick, 'emit');
    
    // Trigger button click
    const buttonElement = fixture.debugElement.query(By.css('.popup__footer button'));
    buttonElement.triggerEventHandler('click', null);
    
    // Verify the output was emitted with the correct action
    expect(buttonClickSpy).toHaveBeenCalledWith('save');
  });

  it('should emit buttonClick with label when action is not provided', () => {
    // Configure buttons
    const testButtons = [
      { label: 'Cancel', type: 'secondary' as const }
    ];
    
    // Update input
    TestBed.runInInjectionContext(() => {
      component.buttons.update(() => testButtons);
    });
    fixture.detectChanges();
    
    // Spy on the output
    const buttonClickSpy = jest.spyOn(component.buttonClick, 'emit');
    
    // Trigger button click
    const buttonElement = fixture.debugElement.query(By.css('.popup__footer button'));
    buttonElement.triggerEventHandler('click', null);
    
    // Verify the output was emitted with the button label as fallback
    expect(buttonClickSpy).toHaveBeenCalledWith('Cancel');
  });
}); 