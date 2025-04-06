import { Component, input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CompanyStat } from '../../../core/models/company-stat.model';

@Component({
  selector: 'app-company-stat-card',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './company-stat-card.component.html',
  styleUrls: ['./company-stat-card.component.scss']
})
export class CompanyStatCardComponent {
  // Use signal input
  companyStat = input<CompanyStat | null>(null);
} 