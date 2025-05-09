import { Component, EventEmitter, Output, inject } from '@angular/core';
import { ButtonComponent } from '../../../reusable/button/button.component';
import { AuthService } from '../../../core/services/auth.service';
import { PopupService } from '../../../core/services/popup.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-top-section',
  standalone: true,
  imports: [ButtonComponent],
  templateUrl: './top-section.component.html',
  styleUrl: './top-section.component.scss',
})
export class TopSectionComponent {
  @Output() uploadResumeClick = new EventEmitter<void>();

  private authService = inject(AuthService);
  private popupService = inject(PopupService);
  private router = inject(Router);

  public uploadResume(): void {
    // Check if user is authenticated
    if (this.authService.isAuthenticated) {
      // User is authenticated, emit event first then navigate
      this.uploadResumeClick.emit();
    } else {
      this.popupService.showLoginPopup();
    }
  }

  public browseResumes(): void {
    this.router.navigate(['/resumes']);
  }
}
