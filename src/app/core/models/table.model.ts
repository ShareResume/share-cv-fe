import { Sort } from '@angular/material/sort';
import { PageEvent } from '@angular/material/paginator';

export interface TableSelectionChange {
  sort: Sort;
  page: PageEvent;
}
