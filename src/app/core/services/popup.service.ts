import { 
  Injectable, inject, TemplateRef, Type 
} from '@angular/core';
import { Router } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { PopupComponent, PopupData } from '../../reusable/popup/popup.component';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root',
})
export class PopupService {
  private dialog = inject(MatDialog);
  private router = inject(Router);
  private authService = inject(AuthService);

  showLoginPopup(returnUrl?: string) {
    const currentUrl = this.router.url;
    this.authService.setRedirectUrl(returnUrl || currentUrl);
    
    const dialogData: PopupData = {
      title: 'Authentication Required',
      content: 'To upload resume you need to login to system',
      buttons: [
        {
          label: 'Cancel',
          type: 'secondary',
          action: 'cancel'
        },
        {
          label: 'Go to Login',
          type: 'primary',
          action: 'login'
        }
      ]
    };

    const dialogRef = this.dialog.open(PopupComponent, {
      width: '400px',
      data: dialogData,
      disableClose: true
    });

    return dialogRef.afterClosed().subscribe(result => {
      if (result === 'login') {
        this.router.navigate(['/login']);
      }
    });
  }

  openPopup(data: PopupData) {
    return this.dialog.open(PopupComponent, {
      width: '400px',
      data,
      disableClose: true
    });
  }
} 