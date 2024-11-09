import { Component, OnInit } from '@angular/core';
import { Project } from './shared/models/project.model';
import { FundingFormComponent } from './shared/components/funding-form.component';
import { ProjectCardComponent } from './shared/components/project-card.component';
import { CommonModule } from '@angular/common';
import { ProjectService } from './shared/services/project.service';
import { ContributionService } from './shared/services/contribution.service';
import { NotificationService } from './shared/services/notification.service';
import { MessageService } from 'primeng/api';
import { ToastModule } from 'primeng/toast';
import { ProjectCreationFormComponent } from './shared/components/create-form.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { HttpClientModule } from '@angular/common/http'; // Ajout de l'import


@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    FundingFormComponent, 
    ProjectCardComponent, 
    CommonModule, 
    ToastModule, 
    ProjectCreationFormComponent,
    HttpClientModule, // Ajout dans les imports
  ],
  providers: [MessageService, NotificationService, ProjectService, ContributionService], // Ajout des services
  template: `
    <p-toast position="top-right" [baseZIndex]="1000"></p-toast>
    <div class="container">
      <div class="header">
        <h1>Crowdfunding Projects</h1>
        <button class="button" (click)="showCreationForm()">
          Créer un projet
        </button>
      </div>

      <app-project-creation-form
        *ngIf="isCreatingProject"
        (onSubmit)="createProject($event)"
        (onClose)="isCreatingProject = false">
      </app-project-creation-form>

      <app-funding-form
        *ngIf="selectedProject"
        [project]="selectedProject"
        (onSubmit)="fundProject($event)">
      </app-funding-form>

      <div class="projects">
        <app-project-card 
          *ngFor="let project of projects"
          [project]="project"
          (onFund)="selectProject(project)">
        </app-project-card>
      </div>
    </div>
  `,
  styles: [`
    :host ::ng-deep .p-toast {
      z-index: 1000;
    }
    
    :host ::ng-deep .p-toast-message {
      margin: 0 0 1rem 0;
    }
  `]
})
export class AppComponent implements OnInit {
  projects: Project[] = [];
  selectedProject: Project | null = null;
  isCreatingProject = false;


  constructor( private projectService: ProjectService,
    private contributionService: ContributionService, private notificationService: NotificationService, private messageService: MessageService // Ajoutez cette ligne
  ) {}

    ngOnInit() { this.loadProjects(); // Ajoutez cette ligne pour tester
      this.messageService.add({severity:'success', summary:'Test', detail:'Toast Test Message', life:8000});}

    //Chargement des Projets existants
    loadProjects(){
      this.projectService.getProjects().subscribe({
        next: (projects) => {
          this.projects = projects;
        },
        error: (error) => {
          this.notificationService.showError('Erreur lors du chargement des projets');
        }
      })
    }


    showCreationForm() {
      this.isCreatingProject = true;
      this.selectedProject = null; // Ferme le formulaire de financement s'il est ouvert
    }

    createProject(projectData: Omit<Project, 'id' | 'raised'>) {
      this.projectService.createProject(projectData).subscribe({
        next: (createdProject) => {
          this.projects = [...this.projects, createdProject];
          this.isCreatingProject = false;
          this.notificationService.showSuccess('Projet créé avec succès');
        },
        error: () => {
          this.notificationService.showError('Erreur lors de la création du projet');
        }
      });
    }

  selectProject(project: Project) {

    //Verifier si le projet est deja selectionne
    this.selectedProject = project;

    this.projectService.getProjectStatus(project.id).subscribe({
      next: (isFunded) => {

        //verifier si le projet a atteint son objectif
        if (isFunded) {
          this.notificationService.showWarning('Ce projet à déja atteint son objectif de financement');
        } else {
          this.selectedProject = project;
        }
      },

      //Gestion des erreurs
      error: () =>{
        this.notificationService.showError("Impossible de vérifier l'état du projet")
      }
    })
  }


//Logique du financement
fundProject(event: {project: Project, amount: number}) {
  console.log('Funding project:', event);

  if (!event.amount || event.amount <= 0) {
    this.notificationService.showError('Le montant doit être supérieur à 0');
    return;
  }

  const contribution = { raised: event.amount };  // Changé de amount à raised
  
  this.projectService.getProject(event.project.id).subscribe({
    next: (currentProject) => {
      const validationResult = this.contributionService.validateContribution(
        currentProject,
        event.amount
      );

      if (!validationResult.valid) {
        this.notificationService.showWarning(validationResult.message || '');
        return;
      }

      this.contributionService.contribute(event.project.id, contribution).subscribe({
        next: (updatedProject) => {
          const index = this.projects.findIndex(p => p.id === updatedProject.id);
          if (index !== -1) {
            this.projects[index] = updatedProject;
          }

          this.notificationService.showSuccess(
            `Contribution de ${event.amount}€ effectuée avec succès pour ${event.project.title}`
          );
          this.selectedProject = null;

          if (updatedProject.raised >= updatedProject.goal) {
            this.notificationService.showSuccess(
              `Le projet ${updatedProject.title} a atteint son objectif!`
            );
          }
        },
        error: (error) => {
          console.error('Contribution error:', error);
          this.notificationService.showError('Erreur lors de la contribution');
        }
      });
    },
    error: (error) => {
      console.error('Project fetch error:', error);
      this.notificationService.showError('Erreur lors de la récupération des données du projet');
    }
  });
}
}