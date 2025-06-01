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
import { UserRoleEnum } from '../../core/enums/user-role.enum';
import { passwordConfirmationValidator } from '../../core/utils/password-confirmation.validator';

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

    // Add password confirmation validator for register form
    if (this.config === registerConfig) {
      this.authForm.addValidators(passwordConfirmationValidator());
    }
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
      next: (response) => {
        const userRole = this.authService.userRole;
        
        // Check if user is admin and redirect accordingly
        if (userRole === UserRoleEnum.ADMIN) {
          this.router.navigate(['/admin']);
        } else {
          const redirectUrl = this.authService.redirectUrl;
          if (redirectUrl && !redirectUrl.includes('/admin')) {
            this.router.navigateByUrl(redirectUrl);
          } else {
            this.router.navigate(['/']);
          }
        }
        
        // Clear any stored redirectUrl
        this.authService.setRedirectUrl(null);
      },
    });
  }

  private handleRegister(): void {
    const { email, password } = this.authForm.value;

    const registerData = {
      email,
      password,
    };

    this.authService.register(registerData).pipe(take(1)).subscribe({
      next: () => {
        this.toasterService.showSuccess('Registration successful! Please log in with your credentials.');
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
