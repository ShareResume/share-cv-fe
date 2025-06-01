import { Component, inject, ElementRef, HostListener } from '@angular/core';
import { RouterLink, RouterLinkActive, Router } from '@angular/router';
import { ButtonComponent } from '../../../reusable/button/button.component';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../services/auth.service';
import { UserRoleEnum } from '../../enums/user-role.enum';
import { LanguageService } from '../../services/language.service';
import { TranslateModule } from '@ngx-translate/core';
import { PopupService } from '../../services/popup.service';
import { PopupData } from '../../../reusable/popup/popup.component';
import { take } from 'rxjs';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
  standalone: true,
  imports: [ButtonComponent, RouterLink, RouterLinkActive, CommonModule, TranslateModule],
})
export class HeaderComponent {
  private authService = inject(AuthService);
  private router = inject(Router);
  private elementRef = inject(ElementRef);
  private popupService = inject(PopupService);
  
  languageService = inject(LanguageService);

  isMenuOpen = false;

  navItems = [
    {
      labelKey: 'header.navigation.overview',
      route: '',
    },
    {
      labelKey: 'header.navigation.resumes',
      route: '/resumes',
    },
  ];

  @HostListener('document:click', ['$event'])
  clickOutside(event: MouseEvent) {
    if (this.isMenuOpen && !this.elementRef.nativeElement.querySelector('.menu-container').contains(event.target)) {
      this.isMenuOpen = false;
    }
  }

  get isAuthenticated(): boolean {
    return this.authService.isAuthenticated;
  }

  get isAdmin(): boolean {
    return this.authService.userRole === UserRoleEnum.ADMIN;
  }
  
  toggleMenu(event: MouseEvent): void {
    event.stopPropagation();
    this.isMenuOpen = !this.isMenuOpen;
  }
  
  signOut(): void {
    this.authService.logout();
    this.isMenuOpen = false;
  }
  
  navigateToProfile(): void {
    this.router.navigate(['/profile']);
    this.isMenuOpen = false;
  }
  
  navigateToLogin(): void {
    this.router.navigate(['/login']);
  }
  
  deleteUser(): void {
    this.isMenuOpen = false;
    
    console.log('Delete user triggered');
    console.log('User authenticated:', this.authService.isAuthenticated);
    console.log('Access token exists:', !!this.authService.getAccessToken());
    
    const dialogData: PopupData = {
      title: 'auth.deleteAccountTitle',
      content: 'auth.deleteAccountContent',
      buttons: [
        {
          label: 'common.cancel',
          type: 'secondary',
          action: 'cancel'
        },
        {
          label: 'auth.deleteAccountConfirm',
          type: 'primary',
          action: 'delete'
        }
      ]
    };

    const dialogRef = this.popupService.openPopup(dialogData);
    
    dialogRef.afterClosed().pipe(take(1)).subscribe(result => {
      if (result === 'delete') {
        console.log('User confirmed deletion, making API call...');
        this.authService.deleteUser().pipe(take(1)).subscribe({
          next: () => {
            console.log('Account deleted successfully');
            const successDialogData: PopupData = {
              title: 'auth.deleteAccountTitle',
              content: 'auth.accountDeletedSuccess',
              buttons: [
                {
                  label: 'common.close',
                  type: 'primary',
                  action: 'close'
                }
              ]
            };
            
            const successDialogRef = this.popupService.openPopup(successDialogData);
            
            successDialogRef.afterClosed().pipe(take(1)).subscribe(() => {
              this.authService.logout();
            });
          },
          error: (error) => {
            console.error('Failed to delete account:', error);
          }
        });
      }
    });
  }
  
  toggleLanguage(): void {
    this.languageService.toggleLanguage();
  }
  
  getCurrentLanguage() {
    return this.languageService.getCurrentLanguageOption();
  }
  
  getOtherLanguageOption() {
    return this.languageService.getOtherLanguageOption();
  }
}
