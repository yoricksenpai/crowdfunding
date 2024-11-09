import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-progress-bar',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="progress-bar">
      <div class="progress-bar-fill" [style.width.%]="getProgress()"></div>
    </div>
    <div>
      <p>{{ raised }} raised of {{ goal }} goal <span> ({{ getProgressPercentage() }}%) </span></p>
    </div>
  `
})
export class ProgressBarComponent {
  @Input() raised!: number;
  @Input() goal!: number;

  getProgress(): number {
    return this.raised > this.goal ? 100 : (this.raised / this.goal) * 100;
  }

  getProgressPercentage(): string {
    return this.getProgress().toFixed(2);
  }
}