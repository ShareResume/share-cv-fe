import { Component, Inject, TemplateRef, Type, signal } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';

import { TranslateModule } from '@ngx-translate/core';
import { PopupContentComponent } from './popup-content.component';

export interface PopupButton {
  label: string;
  type: 'primary' | 'secondary' | 'terniary';
  action?: string;
}

export interface PopupData {
  title: string;
  buttons: PopupButton[];
  content: string | TemplateRef<any> | Type<any>;
}

@Component({
  selector: 'app-popup',
  standalone: true,
  imports: [MatDialogModule, PopupContentComponent, TranslateModule],
  templateUrl: './popup.component.html',
  styleUrl: './popup.component.scss',
})
export class PopupComponent {
  title = signal<string>('');
  buttons = signal<PopupButton[]>([]);
  content = signal<string | TemplateRef<any> | Type<any> | undefined>(undefined);
  
  constructor(
    public dialogRef: MatDialogRef<PopupComponent>,
    @Inject(MAT_DIALOG_DATA) public data: PopupData
  ) {
    this.title.set(data.title);
    this.buttons.set(data.buttons || []);
    this.content.set(data.content);
  }
  
  onCloseClick(): void {
    this.dialogRef.close();
  }
  
  onButtonClick(action: string | undefined): void {
    this.dialogRef.close(action || '');
  }
} 