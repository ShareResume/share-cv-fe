import { Component, input, output } from '@angular/core';
import { PageEvent } from '@angular/material/paginator';
import { IconComponent } from '../icon/icon.component';
import { ButtonComponent } from '../button/button.component';

@Component({
  selector: 'app-paginator',
  imports: [IconComponent, ButtonComponent],
  templateUrl: './paginator.component.html',
  styleUrl: './paginator.component.scss',
  standalone: true,
})
export class PaginatorComponent {
  public total = input<number>(0);
  public pageIndex = input<number>(0);
  public pageSize = input<number>(10);
  
  public pageEvent = output<PageEvent>();

  public nextPage(): void {
    this.pageEvent.emit({
      pageIndex: this.pageIndex()! + 1,
      pageSize: this.pageSize()!,
      length: this.total()!,
      previousPageIndex: this.pageIndex(),
    });
  }

  public get start(): number {
    return this.pageIndex()! * this.pageSize()!;
  }

  public get end(): number {
    return Math.min(this.start + this.pageSize()!, this.total()!);
  }

  public prevPage(): void {
    this.pageEvent.emit({
      pageIndex: this.pageIndex()! - 1,
      pageSize: this.pageSize()!,
      length: this.total()!,
      previousPageIndex: this.pageIndex(),
    });
  }
}
