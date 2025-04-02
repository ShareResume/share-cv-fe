import { 
 // ApplicationRef, ComponentRef, createComponent, EnvironmentInjector, inject, 
  Injectable } from '@angular/core';
// import { Router } from '@angular/router';
// import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root',
})
export class PopupService {
  //private loginPopupRef: ComponentRef<LoginPopupComponent> | null = null;
  // private appRef = inject(ApplicationRef);
  // private injector = inject(EnvironmentInjector);
  // private router = inject(Router);
  // private authService = inject(AuthService);

  showLoginPopup(targetUrl: string) {
    // // Store the target URL for redirect after login
    // this.authService.setRedirectUrl(targetUrl);

    // return new Promise<boolean>((resolve) => {
    //   // Create popup component
    //   this.loginPopupRef = createComponent(LoginPopupComponent, {
    //     environmentInjector: this.injector
    //   });

    //   // Add to DOM
    //   document.body.appendChild(this.loginPopupRef.location.nativeElement);

    //   // Attach to application
    //   this.appRef.attachView(this.loginPopupRef.hostView);

    //   // Handle close event
    //   this.loginPopupRef.instance.close.subscribe((shouldLogin: boolean) => {
    //     if (shouldLogin) {
    //       // User chose to login, redirect handled by login component
    //       resolve(true);
    //     } else {
    //       // User canceled, navigate back to home
    //       this.router.navigate(['']);
    //       resolve(false);
    //     }

    //     this.closePopup();
    //   });
    // });
  }

  private closePopup(): void {
    // if (this.loginPopupRef) {
    //   // Clean up component
    //   this.appRef.detachView(this.loginPopupRef.hostView);
    //   this.loginPopupRef.destroy();
    //   this.loginPopupRef = null;
    // }
  }
} 