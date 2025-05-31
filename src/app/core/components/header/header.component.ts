import { Component, inject, ElementRef, HostListener } from '@angular/core';
import { RouterLink, RouterLinkActive, Router } from '@angular/router';
import { ButtonComponent } from '../../../reusable/button/button.component';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../services/auth.service';
import { UserRoleEnum } from '../../enums/user-role.enum';
import { LanguageService } from '../../services/language.service';
import { TranslateModule } from '@ngx-translate/core';

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
  
  // Inject language service
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
  
  // Language switching methods
  toggleLanguage(): void {
    this.languageService.toggleLanguage();
  }
  
  getCurrentLanguage() {
    return this.languageService.getCurrentLanguageOption();
  }
}
