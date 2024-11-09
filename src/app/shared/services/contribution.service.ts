import { Injectable } from '@angular/core';
import {Project, projectResponse, QueryOptions, Contribution} from '../models';
import {HttpClient} from '@angular/common/http';
import {map} from 'rxjs/operators';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ContributionService {
  private apiUrl = 'http://localhost:3000/api/v1/projects';

  constructor(private http: HttpClient) {}

  contribute(projectId: string, contribution: Contribution): Observable<Project> {
    return this.http.post<projectResponse>(
      `${this.apiUrl}/${projectId}/contribute`,
      contribution
    ).pipe(map(response => response.data as Project));
  }

  validateContribution(project: Project, raised: number): { valid: boolean; message?: string } {
    if (raised <= 0) {
      return { valid: false, message: 'La contribution doit être supérieure à 0' };
    }

    const remainingGoal = project.goal - project.raised;
    if (raised > remainingGoal) {
      return { 
        valid: false, 
        message: `La contribution ne peut pas dépasser le montant restant (${remainingGoal}€)` 
      };
    }

    if (project.raised >= project.goal) {
      return { valid: false, message: 'Ce projet a déjà atteint son objectif' };
    }

    return { valid: true };
  }
}
