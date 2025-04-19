import { Injectable } from '@angular/core';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { PopupComponent, PopupButton, PopupData } from './popup.component';

@Injectable({
  providedIn: 'root'
})
export class PopupService {
  
  constructor(private dialog: MatDialog) {}
  
  /**
   * Opens a popup dialog
   * @param title The title of the popup
   * @param content The content component to be displayed in the popup
   * @param buttons Array of button configurations
   * @param options Additional dialog configuration options
   * @returns An observable that resolves when the dialog is closed, with the action value
   */
  open(
    title: string, 
    content: any, 
    buttons: PopupButton[] = [],
    options: Partial<MatDialogConfig> = {}
  ): Observable<string> {
    const dialogConfig: MatDialogConfig = {
      width: '500px',
      disableClose: false,
      autoFocus: true,
      ...options,
      data: {
        title,
        buttons,
        content
      } as PopupData
    };
    
    const dialogRef = this.dialog.open(PopupComponent, dialogConfig);
    
    return dialogRef.afterClosed();
  }
  
  /**
   * Opens a confirmation dialog with customizable buttons
   * @param title The title of the popup
   * @param message The confirmation message
   * @param confirmButton The label for the confirm button (default: 'Confirm')
   * @param cancelButton The label for the cancel button (default: 'Cancel')
   * @returns An observable that resolves to true when confirmed, false otherwise
   */
  confirm(
    title: string,
    message: string,
    confirmButton: string = 'Confirm',
    cancelButton: string = 'Cancel'
  ): Observable<boolean> {
    const buttons: PopupButton[] = [
      { label: cancelButton, type: 'secondary', action: 'cancel' },
      { label: confirmButton, type: 'primary', action: 'confirm' }
    ];
    
    return this.open(title, message, buttons).pipe(
      map((result: string) => result === 'confirm')
    );
  }
} 