import { Component, inject } from '@angular/core';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { registerCustomIcons } from './core/utils/icon-registrator';
import { RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    TranslateModule,
    RouterOutlet,
  ],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
})
export class AppComponent {
  private readonly translate: TranslateService = inject(TranslateService);

  public constructor() {
    registerCustomIcons();
    this.translate.setDefaultLang('en');
    this.translate.use('en');
  }
}
