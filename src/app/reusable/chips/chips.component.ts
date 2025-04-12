import { Component, computed, input } from '@angular/core';
import { MatChipsModule } from '@angular/material/chips';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-chips',
  standalone: true,
  imports: [MatChipsModule, CommonModule],
  templateUrl: './chips.component.html',
  styleUrl: './chips.component.scss',
})
export class ChipsComponent {
  public status = input('');
  
  public statusClass = computed(() => {
    return this.status().trim().toLowerCase().replace(/\s+/g, '-');
  });
}
