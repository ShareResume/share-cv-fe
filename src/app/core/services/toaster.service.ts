import { inject, Injectable } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ToasterComponent } from '../components/toaster/toaster.component';
import { ToasterData, ToasterResult } from '../models/toaster.model';
import { ToasterStatus } from '../constants/toaster.constants';

@Injectable({
  providedIn: 'root',
})
export class ToasterService {
  private readonly toasterService: MatSnackBar = inject(MatSnackBar);

  private panelClasses: Record<ToasterStatus, string> = {
    [ToasterStatus.SUCCESS]: 'success',
    [ToasterStatus.INFO]: 'info',
    [ToasterStatus.ERROR]: 'error',
  };

  private showToaster(
    message: string,
    status: ToasterStatus,
    action?: string,
    duration?: number,
  ): ToasterResult | null {

    const toaster = this.toasterService.openFromComponent<
      ToasterComponent,
      ToasterData
    >(ToasterComponent, {
      data: {
        action,
        message,
        status,
      },
      panelClass: this.panelClasses[status],
      duration: duration,
    });

    return {
      onAction: toaster.onAction.bind(toaster),
    };
  }

  public showSuccess(message: string, action?: string): ToasterResult | null {
    return this.showToaster(message, ToasterStatus.SUCCESS, action, 4000);
  }

  public showError(message: string, action?: string): ToasterResult | null {
    return this.showToaster(message, ToasterStatus.ERROR, action, 4000);
  }

  public showInfo(message: string, action?: string): ToasterResult | null {
    return this.showToaster(message, ToasterStatus.INFO, action, 4000);
  }
}
