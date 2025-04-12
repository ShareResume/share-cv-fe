import { Component } from '@angular/core';
import { ShellComponent } from '../shell/shell.component';

@Component({
  selector: 'app-main-layout',
  standalone: true,
  imports: [ShellComponent],
  templateUrl: './main-layout.component.html',
  styleUrls: ['./main-layout.component.scss'],
})
export class MainLayoutComponent {} 