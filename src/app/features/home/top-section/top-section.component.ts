import { Component, EventEmitter, Output, inject } from '@angular/core';
import { ButtonComponent } from '../../../reusable/button/button.component';
import { AuthService } from '../../../core/services/auth.service';
import { PopupService } from '../../../core/services/popup.service';
import { Router } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';

@Component({
  selector: 'app-top-section',
  standalone: true,
  imports: [ButtonComponent, TranslateModule],
  templateUrl: './top-section.component.html',
  styleUrl: './top-section.component.scss',
})
export class TopSectionComponent {
  @Output() uploadResumeClick = new EventEmitter<void>();

  private authService = inject(AuthService);
  private popupService = inject(PopupService);
  private router = inject(Router);

  public uploadResume(): void {
    if (this.authService.isAuthenticated) {
      this.uploadResumeClick.emit();
    } else {
      this.popupService.showLoginPopup();
    }
  }

  public browseResumes(): void {
    if (this.authService.isAuthenticated) {
      this.router.navigate(['/resumes']);
    } else {
      this.popupService.showLoginPopup('/resumes');
    }
  }
}
