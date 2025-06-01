import { Component, inject } from '@angular/core';
import { TopSectionComponent } from './top-section/top-section.component';
import { MatDialog } from '@angular/material/dialog';
import { UploadResumePopupComponent } from '../../core/popups/upload-resume-popup/upload-resume-popup.component';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [TopSectionComponent],
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
})
export class HomeComponent {
  private dialog = inject(MatDialog);
  
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
} 