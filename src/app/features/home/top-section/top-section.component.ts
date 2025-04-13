import { Component, EventEmitter, Output } from '@angular/core';
import { ButtonComponent } from '../../../reusable/button/button.component';

@Component({
  selector: 'app-top-section',
  standalone: true,
  imports: [ButtonComponent],
  templateUrl: './top-section.component.html',
  styleUrl: './top-section.component.scss',
})
export class TopSectionComponent {
  @Output() uploadResumeClick = new EventEmitter<void>();

  public uploadResume(): void {
    this.uploadResumeClick.emit();
  }

  public browseResumes(): void {
    console.log('Browse resumes button clicked');
  }
}
