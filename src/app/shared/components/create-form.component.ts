import { Component, EventEmitter, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Project } from '../models/project.model';

@Component({
  selector: 'app-project-creation-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  template: `
    <div class="project-form card">
      <h2>Créer un nouveau projet</h2>
      <form [formGroup]="projectForm" (ngSubmit)="submitForm()">
        <div class="form-group">
          <label for="title">Titre</label>
          <input type="text" id="title" formControlName="title">
        </div>

        <div class="form-group">
          <label for="description">Description</label>
          <textarea id="description" formControlName="description"></textarea>
        </div>

        <div class="form-group">
          <label for="goal">Objectif (€)</label>
          <input type="number" id="goal" formControlName="goal">
        </div>

        <div class="button-group">
          <button class='button' type="submit">Créer le projet</button>
          <button  class='button' type="button" (click)="onCancel()">Annuler</button>
        </div>
      </form>
    </div>
  `
})
export class ProjectCreationFormComponent {
  @Output() onSubmit = new EventEmitter<Omit<Project, 'id' | 'raised'>>();
  @Output() onClose = new EventEmitter<void>();

  projectForm: FormGroup;

  constructor(private fb: FormBuilder) {
    this.projectForm = this.fb.group({
      title: ['', Validators.required],
      description: ['', Validators.required],
      goal: [0, [Validators.required, Validators.min(1)]]
    });
  }

  submitForm() {
    if (this.projectForm.valid) {
      console.log('Form values before submit:', this.projectForm.value); // Ajoutez ce log
      const formValue = this.projectForm.value;
      const projectData: Omit<Project, 'id' | 'raised'> = {
        title: formValue.title,
        description: formValue.description,
        goal: Number(formValue.goal)  
      };
      this.onSubmit.emit(projectData);
      this.projectForm.reset();
    }
}
  onCancel() {
    this.projectForm.reset();
    this.onClose.emit();
  }
}