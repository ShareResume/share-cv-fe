import { Component, input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CompanyStatCardComponent } from '../company-stat-card/company-stat-card.component';
import { CompanyStat } from '../../../core/models/company-stat.model';

@Component({
  selector: 'app-stat-card',
  standalone: true,
  imports: [CommonModule, CompanyStatCardComponent],
  templateUrl: './stat-card.component.html',
  styleUrls: ['./stat-card.component.scss'],
})
export class StatCardComponent {
  title = input<string>('');
  companies = input<CompanyStat[]>([]);
} 