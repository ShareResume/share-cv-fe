import { Component } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { ButtonComponent } from '../../../reusable/button/button.component';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
  standalone: true,
  imports: [
    ButtonComponent, 
    RouterLink, 
    RouterLinkActive, 
    CommonModule
  ],
})
export class HeaderComponent {
  navItems = [
    { label: 'Overview', route: '/overview' },
    { label: 'Browse', route: '/browse' },
    { label: 'Insights', route: '/insights' },
    { label: 'Forum', route: '/forum' }
  ];

  constructor() { }
}
