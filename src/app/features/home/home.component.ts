import { Component, DestroyRef, OnInit, inject, signal } from '@angular/core';
import { TopSectionComponent } from './top-section/top-section.component';
import { StatisticsSectionComponent } from './statistics-section/statistics-section.component';
import { HomeService } from './services/home.service';
import { CompanyStat } from '../../core/models/company-stat.model';
import { catchError, finalize } from 'rxjs/operators';
import { of } from 'rxjs';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { MatDialog } from '@angular/material/dialog';
import { UploadResumePopupComponent } from '../../core/popups/upload-resume-popup/upload-resume-popup.component';
import { CompanyAutocompleteComponent } from "../../reusable/company-autocomplete/company-autocomplete.component";

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [TopSectionComponent, StatisticsSectionComponent, CompanyAutocompleteComponent],
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
})
export class HomeComponent implements OnInit {
  private homeService = inject(HomeService);
  private destroyRef = inject(DestroyRef);
  private dialog = inject(MatDialog);
  
  statisticsData = signal<CompanyStat[]>([]);
  isLoadingStatistics = signal<boolean>(true);
  statisticsError = signal<string | null>(null);
  
  ngOnInit(): void {
    this.loadStatistics();
  }
  
  openUploadResumePopup(): void {
    const dialogRef = this.dialog.open(UploadResumePopupComponent, {
      width: '600px',
      disableClose: true
    });
    
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        // TODO: Handle the resume data submission
      }
    });
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
        }),
      )
      .subscribe({
        next: (data) => {
          this.statisticsData.set(data);
        },
      });
  }
} 