import { Component, inject } from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';
import { registerCustomIcons } from './core/utils/icon-registrator';
import { RouterOutlet } from '@angular/router';
import { LanguageService } from './core/services/language.service';

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
  private readonly languageService = inject(LanguageService);

  public constructor() {
    registerCustomIcons();
  }
}
