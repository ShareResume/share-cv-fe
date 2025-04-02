import { Component, inject, OnInit, ViewEncapsulation } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  ValidatorFn,
} from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';

import { take } from 'rxjs';
import { InputComponent } from '../../reusable/input/input.component';
import { ButtonComponent } from '../../reusable/button/button.component';
import { IconComponent } from '../../reusable/icon/icon.component';
import { AuthService } from '../../core/services/auth.service';
import { ToasterService } from '../../core/services/toaster.service';
import { forgotPasswordConfig, loginConfig, registerConfig } from '../../core/constants/auth-page-configs.constants';
import { AuthPageConfig } from '../../core/models/auth-page-config.model';

@Component({
  selector: 'app-auth',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    InputComponent,
    ButtonComponent,
    IconComponent,
    RouterLink,
  ],
  templateUrl: './auth.component.html',
  styleUrl: './auth.component.scss',
  encapsulation: ViewEncapsulation.None,
})
export class AuthComponent implements OnInit {
  private fb = inject(FormBuilder);
  private route = inject(ActivatedRoute);
  private authService = inject(AuthService);
  private router = inject(Router);
  private toasterService = inject(ToasterService);

  public config!: AuthPageConfig;
  public authForm!: FormGroup;

  public ngOnInit(): void {
    this.route.data.subscribe(data => {
      this.config = data['config'];
      this.initializeForm();
    });
  }

  private initializeForm(): void {
    if (!this.config) {
      return;
    }

    const formControls: Record<string, [string, ValidatorFn[]]> = {};

    this.config?.fields?.forEach(field => {
      formControls[field.name] = ['', field.validators || []];
    });
    this.authForm = this.fb.group(formControls);
  }

  public onSubmit(): void {
    if (!this.authForm.valid) {
      return;
    }

    switch (this.config) {
      case loginConfig:
        this.handleLogin();
        break;

      case registerConfig:
        this.handleRegister();
        break;

      case forgotPasswordConfig:
        this.handleForgotPassword();
        break;

      default:
        console.warn(
          'No matching config logic found. Form data:',
          this.authForm.value,
        );
        break;
    }
  }

  private handleLogin(): void {
    const { email, password } = this.authForm.value;

    this.authService.login(email, password).pipe(take(1)).subscribe({
      next: () => {
        this.authService.setAuthenticated(true);
        
        const redirectUrl = this.authService.redirectUrl;

        if (redirectUrl) {
          this.router.navigateByUrl(redirectUrl);
          this.authService.setRedirectUrl(null);
        } else {
          this.router.navigate(['/mentor']);
        }
      },
    });
  }

  private handleRegister(): void {
    const { firstName, lastName, username, password, confirmPassword } = this.authForm.value;

    const registerData = {
      firstName,
      lastName,
      username,
      password,
      confirmPassword,
    };

    this.authService.register(registerData).pipe(take(1)).subscribe({
      next: () => {
        this.router.navigate(['/login']);
      },
    });
  }

  private handleForgotPassword(): void {
    const { email } = this.authForm.value;

    this.authService.resetPassword(email).pipe(take(1)).subscribe({
      next: () => {
        this.toasterService.showSuccess('Password reset instructions have been sent to your email');
        this.router.navigate(['/login']);
      },
      error: (error) => {
        this.toasterService.showError(error.message || 'Failed to send reset instructions');
      },
    });
  }
}
