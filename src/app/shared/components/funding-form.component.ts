// funding-form.component.ts
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Project } from '../models/project.model';

@Component({
  selector: 'app-funding-form',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="card" *ngIf="project">
      <h2>Fund <span>{{ project.title }}</span></h2>

      <div class='contribute'>
        <input
          type="number"
          class="input"
          placeholder="Enter amount"
          [(ngModel)]="amount"
          min="0"
        />
        <button type="button" (click)="submitFunding()" class="button">
          Contribute
        </button>
      </div>

      <!-- Optionnel: Afficher le montant actuel pour debug -->
      <div class="debug-info">
        <small>Amount: {{amount}}</small>
      </div>
    </div>
  `,
  styles: [`
    .debug-info {
      margin-top: 10px;
      color: #666;
    }
  `]
})
export class FundingFormComponent {
  @Input() project!: Project;
  @Output() onSubmit = new EventEmitter<{project: Project, amount: number}>();
  
  amount: number = 0;

  submitFunding() {
    console.log('Submit funding called', { amount: this.amount, project: this.project });
    
    if (this.project && this.amount > 0) {
      // Émettre l'événement avec les données correctes
      this.onSubmit.emit({
        project: this.project,
        amount: this.amount
      });
    }
  }
}