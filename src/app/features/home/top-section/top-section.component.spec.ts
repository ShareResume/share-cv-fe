import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TopSectionComponent } from './top-section.component';

describe('TopSectionComponent', () => {
  let component: TopSectionComponent;
  let fixture: ComponentFixture<TopSectionComponent>;

  beforeEach(async() => {
    await TestBed.configureTestingModule({
      imports: [TopSectionComponent],
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
