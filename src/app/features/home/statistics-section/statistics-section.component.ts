import { Component, computed, input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CompanyStat } from '../../../core/models/company-stat.model';
import { StatCardComponent } from '../stat-card/stat-card.component';
import { TranslateModule } from '@ngx-translate/core';

@Component({
  selector: 'app-statistics-section',
  standalone: true,
  imports: [CommonModule, StatCardComponent, TranslateModule],
  templateUrl: './statistics-section.component.html',
  styleUrls: ['./statistics-section.component.scss'],
})
export class StatisticsSectionComponent {
  // Use signal inputs
  statistics = input<CompanyStat[]>([]);
  isLoading = input<boolean>(false);
  error = input<string | null>(null);

  // Computed signals to group statistics by category
  categories = computed(() => {
    // Get unique categories from the statistics array
    const stats = this.statistics();

    if (!stats || stats.length === 0) {
return [];
}

    // Find unique categories in the data
    const uniqueCategories = [...new Set(stats.map(stat => stat.category))];
    
    // For each category, create an object with title and filtered companies
    return uniqueCategories.map(category => ({
      category,
      title: CompanyStat.getCategoryTitle(category),
      companies: stats.filter(stat => stat.category === category),
    }));
  });
} 