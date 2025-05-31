import { Routes } from '@angular/router';
import { AuthComponent } from './features/auth/auth.component';
import {
  forgotPasswordConfig,
  loginConfig,
  passwordResetConfig,
  registerConfig,
  successfulPasswordResetConfig,
} from './core/constants/auth-page-configs.constants';
import { HomeComponent } from './features/home/home.component';
import { popupGuard } from './core/providers/popup.guard';
import { MainLayoutComponent } from './core/components/main-layout/main-layout.component';
import { AuthLayoutComponent } from './core/components/auth-layout/auth-layout.component';
import { adminGuard } from './core/providers/admin.guard';
import { ProfilePageComponent } from './features/profile/profile-page.component';

export const routes: Routes = [
  {
    path: '',
    component: MainLayoutComponent,
    children: [
      {
        path: '',
        component: HomeComponent,
      },
      {
        path: 'profile',
        component: ProfilePageComponent,
        canActivate: [popupGuard],
      },
      {
        path: 'resumes',
        loadComponent: () => import('./features/resume/resume-page.component').then(m => m.ResumePageComponent),
      },
      {
        path: 'resumes/:id',
        loadComponent: () => import('./features/resume/components/resume-detail/resume-detail-page.component').then(m => m.ResumeDetailPageComponent),
      },
      {
        path: 'admin',
        loadComponent: () => import('./features/admin/pages/admin-page.component').then(m => m.AdminPageComponent),
        canActivate: [adminGuard],
      },
      {
        path: 'admin/resume/:id',
        loadComponent: () => import('./features/admin/pages/admin-resume-detail-page.component').then(m => m.AdminResumeDetailPageComponent),
        canActivate: [adminGuard],
      },
    ],
  },
  {
    path: '',
    component: AuthLayoutComponent,
    children: [
      {
        path: 'login',
        component: AuthComponent,
        data: { config: loginConfig },
      },
      {
        path: 'register',
        component: AuthComponent,
        data: { config: registerConfig },
      },
      {
        path: 'forgot-password',
        component: AuthComponent,
        data: {
          config: forgotPasswordConfig,
        },
      },
      {
        path: 'reset-password',
        component: AuthComponent,
        data: { config: passwordResetConfig },
      },
      {
        path: 'reset-success',
        component: AuthComponent,
        data: { config: successfulPasswordResetConfig },
      },
    ],
  },
  {
    path: '**',
    redirectTo: '',
    pathMatch: 'full',
  },
];
