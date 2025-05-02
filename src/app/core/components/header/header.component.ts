import { Component, inject, ElementRef, HostListener } from '@angular/core';
import { RouterLink, RouterLinkActive, Router } from '@angular/router';
import { ButtonComponent } from '../../../reusable/button/button.component';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../services/auth.service';
import { UserRoleEnum } from '../../enums/user-role.enum';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
  standalone: true,
  imports: [ButtonComponent, RouterLink, RouterLinkActive, CommonModule],
})
export class HeaderComponent {
  private authService = inject(AuthService);
  private router = inject(Router);
  private elementRef = inject(ElementRef);

  isMenuOpen = false;

  navItems = [
    {
      label: 'Overview',
      route: '',
    },
    {
      label: 'Resumes',
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
}
