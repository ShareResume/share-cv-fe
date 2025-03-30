import {
  Component,
  input,
} from '@angular/core';
import { MatIcon } from '@angular/material/icon';

@Component({
  selector: 'app-icon',
  templateUrl: './icon.component.html',
  styleUrl: './icon.component.scss',
  imports: [MatIcon],
  standalone: true,
})
export class IconComponent {
  public iconName = input<string>();
}
