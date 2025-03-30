import { Component } from '@angular/core';
import { TopSectionComponent } from './top-section/top-section.component';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [TopSectionComponent],
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent {} 