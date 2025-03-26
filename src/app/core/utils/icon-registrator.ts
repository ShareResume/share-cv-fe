import { MatIconRegistry } from '@angular/material/icon';
import { inject } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { icons } from '../constants/icon.constants';

export function registerCustomIcons(
  registry?: MatIconRegistry,
  sanitizer?: DomSanitizer,
): void {
  const matIconRegistry: MatIconRegistry = registry || inject(MatIconRegistry);
  const domSanitizer: DomSanitizer = sanitizer || inject(DomSanitizer);

  Object.keys(icons).forEach(icon => {
    matIconRegistry.addSvgIcon(
      icon,
      domSanitizer.bypassSecurityTrustResourceUrl(icons[icon]),
    );
  });
}
