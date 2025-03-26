import { Component, inject } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { registerCustomIcons } from './core/utils/icon-registrator';
import { ShellComponent } from "./core/components/shell/shell.component";

@Component({
  selector: 'app-root',
  imports: [
    TranslateModule,
    ShellComponent
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
