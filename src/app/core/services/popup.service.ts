import { 
  Injectable, inject, TemplateRef, Type 
} from '@angular/core';
import { Router } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { TranslateService } from '@ngx-translate/core';
import { PopupComponent, PopupData } from '../../reusable/popup/popup.component';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root',
})
export class PopupService {
  private dialog = inject(MatDialog);
  private router = inject(Router);
  private authService = inject(AuthService);
  private translate = inject(TranslateService);

  showLoginPopup(returnUrl?: string) {
    const currentUrl = this.router.url;
    this.authService.setRedirectUrl(returnUrl || currentUrl);
    
    const dialogData: PopupData = {
      title: this.translate.instant('popup.authRequired.title'),
      content: this.translate.instant('popup.authRequired.content'),
      buttons: [
        {
          label: this.translate.instant('popup.authRequired.cancel'),
          type: 'secondary',
          action: 'cancel'
        },
        {
          label: this.translate.instant('popup.authRequired.goToLogin'),
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