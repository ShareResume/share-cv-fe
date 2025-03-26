import { Component, inject } from '@angular/core';
import {
  MAT_SNACK_BAR_DATA,
  MatSnackBarRef,
} from '@angular/material/snack-bar';
import { ToasterData } from '../../models/toaster.model';

@Component({
  selector: 'app-toaster',
  imports: [],
  templateUrl: './toaster.component.html',
  styleUrl: './toaster.component.scss',
})
export class ToasterComponent {
  public readonly data: ToasterData = inject<ToasterData>(MAT_SNACK_BAR_DATA);
  public readonly toasterRef: MatSnackBarRef<ToasterComponent>
    = inject(MatSnackBarRef);

  public onAction(): void {
    this.toasterRef.dismissWithAction();
  }
}
