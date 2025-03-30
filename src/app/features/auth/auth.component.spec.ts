import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';
import { of } from 'rxjs';
import { AuthComponent } from './auth.component';
import { AuthPageConfig } from '../../core/models/auth-page-config.model';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { TransferState } from '@angular/core';

describe('AuthComponent', () => {
  let component: AuthComponent;
  let fixture: ComponentFixture<AuthComponent>;

  const activatedRouteStub = {
    data: of({
      config: {
        title: 'Test Title',
        welcomePhrase: 'Welcome to ShareCv',
        fields: [],
      } as AuthPageConfig,
    }),
  };

  beforeEach(async() => {
    await TestBed.configureTestingModule({
      imports: [AuthComponent, HttpClientTestingModule],
      providers: [
        {
          provide: ActivatedRoute, useValue: activatedRouteStub, 
        },
        TransferState,
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(AuthComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
