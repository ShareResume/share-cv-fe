import { Component, Input, TemplateRef, Type } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';

@Component({
  selector: 'app-popup-content',
  standalone: true,
  imports: [CommonModule, TranslateModule],
  template: `
    @if (isTemplate(content)) {
      <ng-container [ngTemplateOutlet]="content"></ng-container>
    } @else if (isComponent(content)) {
      <ng-container *ngComponentOutlet="content"></ng-container>
    } @else if (isString(content)) {
      <p>{{ content | translate }}</p>
    }
  `,
  styles: [`
    :host {
      display: block;
    }
    
    p {
      margin: 0;
      white-space: pre-line;
    }
  `]
})
export class PopupContentComponent {
  @Input() content: string | TemplateRef<any> | Type<any> | undefined;
  
  isTemplate(content: any): content is TemplateRef<any> {
    return content instanceof TemplateRef;
  }
  
  isComponent(content: any): content is Type<any> {
    return content && typeof content === 'function' && content.prototype;
  }
  
  isString(content: any): content is string {
    return typeof content === 'string';
  }
} 