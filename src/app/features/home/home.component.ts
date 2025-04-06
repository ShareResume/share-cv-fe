import { Component, DestroyRef, OnInit, inject, signal } from '@angular/core';
import { TopSectionComponent } from './top-section/top-section.component';
import { StatisticsSectionComponent } from './statistics-section/statistics-section.component';
import { HomeService } from './services/home.service';
import { CompanyStat } from '../../core/models/company-stat.model';
import { catchError, finalize } from 'rxjs/operators';
import { of } from 'rxjs';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [TopSectionComponent, StatisticsSectionComponent],
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
})
export class HomeComponent implements OnInit {
  private homeService = inject(HomeService);
  private destroyRef = inject(DestroyRef);
  
  statisticsData = signal<CompanyStat[]>([]);
  isLoadingStatistics = signal<boolean>(true);
  statisticsError = signal<string | null>(null);
  
  ngOnInit(): void {
    this.loadStatistics();
  }
  
  private loadStatistics(): void {
    this.isLoadingStatistics.set(true);
    this.statisticsError.set(null);

    this.homeService.getStatistics()
      .pipe(
        takeUntilDestroyed(this.destroyRef),
        catchError(err => {
          console.error('Error loading statistics:', err);
          this.statisticsError.set('Failed to load statistics. Please try again later.');
          // Return empty array to avoid breaking the app
          return of([]);
        }),
        finalize(() => {
          this.isLoadingStatistics.set(false);
        })
      )
      .subscribe({
        next: (data) => {
          this.statisticsData.set(data);
        }
      });
  }
} 