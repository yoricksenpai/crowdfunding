import { Component, EventEmitter, Input, Output } from '@angular/core';
import { Project } from '../models/project.model';
import { ProgressBarComponent } from './progress-bar.component';
@Component({
  selector: 'app-project-card',
  standalone: true,
  imports: [ProgressBarComponent],
  template: `
    <div class="card">
      <div class="about-part">
      <h2>{{ project.title }}</h2>
      <p>{{ project.description }}</p>
    </div>
    <app-progress-bar [raised]="project.raised" [goal]="project.goal "></app-progress-bar>
    <button (click)="fundProject()" class="button">
        Fund this project
      </button>
    </div>
  `
})
export class ProjectCardComponent {
  @Input() project!: Project;
  @Output() onFund = new EventEmitter<Project>();

  fundProject(){
    this.onFund.emit(this.project);
  }
}