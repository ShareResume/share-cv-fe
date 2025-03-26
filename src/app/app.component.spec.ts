import { TestBed } from '@angular/core/testing';
import { AppComponent } from './app.component';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ShellComponent } from './core/components/shell/shell.component';
import { Component } from '@angular/core';

// Create a mock for ShellComponent to avoid loading its dependencies
@Component({
  selector: 'app-shell',
  template: '<div></div>',
})
class MockShellComponent {}

describe('AppComponent', () => {
  beforeEach(async() => {
    await TestBed.configureTestingModule({
      imports: [
        AppComponent,
        TranslateModule.forRoot(),
        HttpClientTestingModule,
      ],
      providers: [TranslateService],
    })
    .overrideComponent(AppComponent, {
      remove: { imports: [ShellComponent] },
      add: { imports: [MockShellComponent] },
    })
    .compileComponents();
  });

  it('should create the app', () => {
    const fixture = TestBed.createComponent(AppComponent);
    const app = fixture.componentInstance;

    expect(app).toBeTruthy();
  });
});
