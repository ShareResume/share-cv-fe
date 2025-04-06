import {
  AfterViewInit,
  Component,
  DestroyRef,
  inject,
  input,
  output,
  Signal,
  TemplateRef,
  viewChild,
} from '@angular/core';
import {
  MatCell,
  MatColumnDef,
  MatHeaderCell,
  MatHeaderRow,
  MatRow,
  MatTableDataSource,
  MatTableModule,
} from '@angular/material/table';
import { MatSort, MatSortModule, Sort } from '@angular/material/sort';
import { NgTemplateOutlet } from '@angular/common';
import { PageEvent } from '@angular/material/paginator';
import { combineLatest, startWith, Subject } from 'rxjs';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { PaginatorComponent } from '../paginator/paginator.component';
import { TableSelectionChange } from '@app/core/models/table.model';

@Component({
  selector: 'app-table',
  templateUrl: './table.component.html',
  styleUrl: './table.component.scss',
  standalone: true,
  imports: [
    MatTableModule,
    MatHeaderCell,
    MatColumnDef,
    MatCell,
    MatSortModule,
    MatHeaderRow,
    MatRow,
    NgTemplateOutlet,
    PaginatorComponent,
  ],
})
export class TableComponent<T> implements AfterViewInit {
  private readonly destroyRef: DestroyRef = inject(DestroyRef);

  public displayedColumns = input<Record<string, string>>({
    id: 'ID',
    name: 'Name',
    weight: 'Weight',
    symbol: 'Symbol',
    actions: '',
  });

  public dataSource = input<MatTableDataSource<T>>(
    new MatTableDataSource<T>([]),
  );

  public customTemplate = input<Record<string, TemplateRef<{ value: string }>>>(
    {},
  );

  public total = input<number>();
  public pageIndex = input<number>(0);
  public pageSize = input<number>(10);
  public interactive = input<boolean>(true);

  public selectionChange = output<TableSelectionChange>();
  public itemClicked = output<T>();

  public sort: Signal<MatSort | undefined> = viewChild(MatSort);

  public pageEvent = new Subject<PageEvent>();
  private isInitialized = false;

  public getTemplate(
    column: string,
  ): TemplateRef<{ value: string }> | undefined {
    return this.customTemplate()![column];
  }

  public get resultsLength(): number {
    return this.dataSource().data.length;
  }

  public ngAfterViewInit(): void {
    let prevSort: Sort = {} as Sort;

    combineLatest([
      this.sort()!.sortChange.pipe(startWith({} as Sort)),
      this.pageEvent.pipe(startWith({} as PageEvent)),
    ])
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe(([sort, page]) => {
        const nextPage = page as PageEvent;
        
        // Ensure next page has all required properties
        if (!nextPage.pageSize) {
          nextPage.pageSize = this.pageSize() || 10;
        }
        
        // Always use the explicitly set total value from the input
        nextPage.length = this.total() as number;

        if (
          sort.active !== prevSort.active
          || sort.direction !== prevSort.direction
        ) {
          // Store previous page index when resetting
          nextPage.previousPageIndex = this.pageIndex();
          nextPage.pageIndex = 0;
        }

        prevSort = sort;

        this.selectionChange.emit({
          sort,
          page: nextPage,
        });
      });
  }
  public get columns(): string[] {
    return Object.keys(this.displayedColumns());
  }
}
