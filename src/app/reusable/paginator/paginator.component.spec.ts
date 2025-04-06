import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PaginatorComponent } from './paginator.component';
import { By } from '@angular/platform-browser';
import { MatIconTestingModule } from '@angular/material/icon/testing';

describe('PaginatorComponent', () => {
  let component: PaginatorComponent;
  let fixture: ComponentFixture<PaginatorComponent>;

  beforeEach(async() => {
    await TestBed.configureTestingModule({
      imports: [ PaginatorComponent, MatIconTestingModule ],
    }).compileComponents();

    fixture = TestBed.createComponent(PaginatorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should show first page', () => {
    fixture.componentRef.setInput('total', 100);
    fixture.componentRef.setInput('pageSize', 10);
    fixture.componentRef.setInput('pageIndex', 0);

    fixture.detectChanges();

    expect(
      fixture.debugElement.query(By.css('.page-indicator')).nativeElement
        .innerText,
    ).toEqual('Showing 0 - 10 of 100 results');
  });

  it('should trigger next page', () => {
    fixture.componentRef.setInput('total', 100);
    fixture.componentRef.setInput('pageSize', 10);
    fixture.componentRef.setInput('pageIndex', 0);
    spyOn(component.pageEvent, 'emit');

    fixture.debugElement
      .query(By.css('.actions app-button:last-child'))
      .nativeElement.click();

    fixture.detectChanges();

    expect(component.pageEvent.emit).toHaveBeenCalledWith({
      pageIndex: 1,
      pageSize: 10,
      length: 100,
      previousPageIndex: 0,
    });
  });
});
