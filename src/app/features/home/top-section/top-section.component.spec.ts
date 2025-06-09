import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';

import { TopSectionComponent } from './top-section.component';
import { TranslateModule, TranslateService } from '@ngx-translate/core';

describe('TopSectionComponent', () => {
  let component: TopSectionComponent;
  let fixture: ComponentFixture<TopSectionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        TopSectionComponent, 
        TranslateModule.forRoot(), 
        HttpClientTestingModule
      ],     
      providers: [TranslateService],
      
    })
      .compileComponents();

    fixture = TestBed.createComponent(TopSectionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
