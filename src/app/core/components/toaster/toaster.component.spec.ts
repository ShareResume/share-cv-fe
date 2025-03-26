import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ToasterComponent } from './toaster.component';
import {
  MAT_SNACK_BAR_DATA,
  MatSnackBarModule,
  MatSnackBarRef,
} from '@angular/material/snack-bar';

describe('ToasterComponent', () => {
  let component: ToasterComponent;
  let fixture: ComponentFixture<ToasterComponent>;

  beforeEach(async() => {
    await TestBed.configureTestingModule({
      imports: [ToasterComponent, MatSnackBarModule],
      providers: [
        {
          provide: MatSnackBarRef,
          useValue: '',
        },
        {
          provide: MAT_SNACK_BAR_DATA,
          useValue: '',
        },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(ToasterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
