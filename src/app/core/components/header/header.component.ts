import { Component, inject } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
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

  navItems = [
    {
      label: 'Overview',
      route: '/overview',
    },
    {
      label: 'Browse',
      route: '/browse',
    },
    {
      label: 'Insights',
      route: '/insights',
    },
    {
      label: 'Forum',
      route: '/forum',
    },
  ];

  get isAuthenticated(): boolean {
    return this.authService.isAuthenticated;
  }

  get isAdmin(): boolean {
    return this.authService.userRole === UserRoleEnum.ADMIN;
  }
}
