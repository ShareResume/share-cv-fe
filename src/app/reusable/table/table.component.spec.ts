import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TableComponent } from './table.component';
import { MatTableDataSource } from '@angular/material/table';
import { By } from '@angular/platform-browser';
import { MatIconTestingModule } from '@angular/material/icon/testing';
interface TestEntry {
  id: string;
  name: string;
}

describe('TableComponent', () => {
  let component: TableComponent<TestEntry>;
  let fixture: ComponentFixture<TableComponent<TestEntry>>;

  beforeEach(async() => {
    await TestBed.configureTestingModule({
      imports: [TableComponent, MatIconTestingModule],
    }).compileComponents();

    fixture
      = TestBed.createComponent<TableComponent<TestEntry>>(TableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should display row', () => {
    expect(component).toBeTruthy();

    fixture.componentRef.setInput('displayedColumns', {
      id: 'ID',
      name: 'Name',
    });

    fixture.componentRef.setInput(
      'dataSource',
      new MatTableDataSource([
        {
          id: 'ID',
          name: 'Name',
        },
      ]),
    );

    fixture.detectChanges();

    expect(fixture.debugElement.query(By.css('.mat-mdc-row'))).toBeTruthy();
  });

  it('should display paginator', () => {
    expect(component).toBeTruthy();

    fixture.componentRef.setInput('displayedColumns', {
      id: 'ID',
      name: 'Name',
    });

    fixture.componentRef.setInput(
      'dataSource',
      new MatTableDataSource([
        {
          id: 'ID',
          name: 'Name',
        },
      ]),
    );

    fixture.componentRef.setInput('total', 25);
    fixture.componentRef.setInput('pageSize', 10);

    fixture.detectChanges();

    expect(fixture.debugElement.query(By.css('app-paginator'))).toBeTruthy();
  });

  it('should reset paginator', () => {
    expect(component).toBeTruthy();

    fixture.componentRef.setInput('displayedColumns', {
      id: 'ID',
      name: 'Name',
    });

    fixture.componentRef.setInput(
      'dataSource',
      new MatTableDataSource([
        {
          id: 'ID',
          name: 'Name',
        },
      ]),
    );

    fixture.componentRef.setInput('total', 10);

    fixture.componentRef.setInput('pageIndex', 2);
    spyOn(component.selectionChange, 'emit');

    fixture.detectChanges();

    fixture.debugElement
      .query(By.css('.mat-column-name .mat-sort-header-container'))
      .nativeElement.click();

    fixture.detectChanges();

    expect(component.selectionChange.emit).toHaveBeenCalledWith({
      sort: {
        active: 'name',
        direction: 'asc',
      },
      page: { 
        pageIndex: 0,
        pageSize: 10,
        length: 10,
        previousPageIndex: 2,
      },
    });
  });
});
