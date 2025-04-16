import { Component, ElementRef, HostListener, input, output } from '@angular/core';

export interface PopupButton {
  label: string;
  type: 'primary' | 'secondary' | 'terniary';
  action?: string;
}

@Component({
  selector: 'app-popup',
  standalone: true,
  templateUrl: './popup.component.html',
  styleUrl: './popup.component.scss',
})
export class PopupComponent {
  public title = input<string>('');
  public buttons = input<PopupButton[]>([]);
  public isVisible = input<boolean>(true);
  
  public close = output<void>();
  public buttonClick = output<string>();
  
  constructor(private elementRef: ElementRef) {}
  
  @HostListener('document:click', ['$event'])
  public onClickOutside(event: MouseEvent): void {
    if (!this.elementRef.nativeElement.contains(event.target) && this.isVisible()) {
      this.close.emit();
    }
  }
  
  public onCloseClick(): void {
    this.close.emit();
  }
  
  public onButtonClick(action: string | undefined): void {
    this.buttonClick.emit(action || '');
  }
} 