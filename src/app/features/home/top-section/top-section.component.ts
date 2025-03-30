import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { ButtonComponent } from '../../../reusable/button/button.component';

@Component({
  selector: 'app-top-section',
  standalone: true,
  imports: [ButtonComponent],
  templateUrl: './top-section.component.html',
  styleUrl: './top-section.component.scss'
})
export class TopSectionComponent {

  public uploadResume(): void {
    console.log('Upload resume button clicked');
  }

  public browseResumes(): void {
    console.log('Browse resumes button clicked');
  }
}
