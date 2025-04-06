import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ChipsComponent } from './chips.component';
import { Component } from '@angular/core';

@Component({
  template: `<app-chips [status]="testStatus"></app-chips>`,
  standalone: true,
  imports: [ChipsComponent]
})
class TestHostComponent {
  testStatus = '';
}

describe('ChipsComponent', () => {
  let component: ChipsComponent;
  let fixture: ComponentFixture<ChipsComponent>;

  beforeEach(async() => {
    await TestBed.configureTestingModule({
      imports: [ChipsComponent],
    })
    .compileComponents();

    fixture = TestBed.createComponent(ChipsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should set default status to an empty string', () => {
    expect(component.status()).toBe('');
  });
});

describe('ChipsComponent with TestHost', () => {
  let hostComponent: TestHostComponent;
  let hostFixture: ComponentFixture<TestHostComponent>;
  let chipsComponent: ChipsComponent;

  beforeEach(async() => {
    await TestBed.configureTestingModule({
      imports: [TestHostComponent, ChipsComponent],
    })
    .compileComponents();

    hostFixture = TestBed.createComponent(TestHostComponent);
    hostComponent = hostFixture.componentInstance;
    chipsComponent = hostFixture.debugElement.children[0].componentInstance;
    hostFixture.detectChanges();
  });

  it('should receive status from parent component', () => {
    hostComponent.testStatus = 'Active';
    hostFixture.detectChanges();
    expect(chipsComponent.status()).toBe('Active');
    expect(chipsComponent.statusClass()).toBe('active');
  });

  it('should transform status correctly for class names', () => {
    const testCases = [
      { status: 'Active', expected: 'active' },
      { status: 'In Progress', expected: 'in-progress' },
      { status: 'Pending', expected: 'pending' },
      { status: 'On Hold', expected: 'on-hold' },
      { status: 'Deactivated', expected: 'deactivated' },
      { status: 'Cancelled', expected: 'cancelled' },
      { status: 'Not Started', expected: 'not-started' },
      { status: 'Completed', expected: 'completed' },
      { status: '  Extra  Spaces  ', expected: 'extra-spaces' },
    ];

    testCases.forEach(({ status, expected }) => {
      hostComponent.testStatus = status;
      hostFixture.detectChanges();
      expect(chipsComponent.statusClass()).toBe(expected);
    });
  });
});
