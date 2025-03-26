import { Component, HostBinding, input } from '@angular/core';

@Component({
  selector: 'app-button',
  standalone: true,
  templateUrl: './button.component.html',
  styleUrl: './button.component.scss',
})
export class ButtonComponent {
  public size = input<'small' | 'medium' | 'large'>('medium');
  public colorType = input<'primary' | 'secondary' | 'terniary'>('primary');
  public fontWeight = input<'regular' | 'medium' | 'bold'>('medium');
  public fluid = input<boolean>(false);
  public isLink = input(false);
  public disabled = input(false);

  @HostBinding('class') public get buttonClass(): string {
    return `btn btn--${this.colorType()} btn--${this.size()} btn--${this.colorType()}--${this.size()} btn--weight--${this.fontWeight()}`;
  }
}
