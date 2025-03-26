import { Component } from '@angular/core';
import { ButtonComponent } from '../../../reusable/button/button.component';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
  standalone: true,
  imports: [ButtonComponent],
})
export class HeaderComponent {

  constructor() { }

}
