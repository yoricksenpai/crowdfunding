import { Injectable } from '@angular/core';
import {Project, projectResponse, QueryOptions} from '../models';
import {HttpClient} from '@angular/common/http';
import {map, catchError} from 'rxjs/operators';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ProjectService {
  private apiUrl = 'http://localhost:3000/api/v1/projects';

  constructor(private http: HttpClient) {}

  getProjects(options?: QueryOptions): Observable<Project[]> {
    const params = this.buildQueryParams(options);
    return this.http.get<projectResponse>(this.apiUrl, { params })
      .pipe(
        map(response => {
          const projects = response.data as any[];
          return projects.map(project => ({
            id: project._id,
            title: project.title,
            description: project.description,
            goal: project.goal,
            raised: project.raised
          }));
        })
      );
  }

  getProject(id: string): Observable<Project> {
    return this.http.get<projectResponse>(`${this.apiUrl}/${id}`)
      .pipe(map(response => response.data as Project));
  }

  createProject(project: Omit<Project, 'id'|'raised'>): Observable<Project> {
    console.log('Sending to backend:', project); // Ajoutez ce log
    return this.http.post<projectResponse>(this.apiUrl, project)
      .pipe(
        map(response => response.data as Project),
        catchError(error => {
          console.error('Error details:', error); // Ajoutez ce log
          throw error;
        })
      );
}

  updateProject(id: string, project: Partial<Project>): Observable<Project> {
    return this.http.put<projectResponse>(`${this.apiUrl}/${id}`, project)
      .pipe(map(response => response.data as Project));
  }

  deleteProject(id: string): Observable<void> {
    return this.http.delete<projectResponse>(`${this.apiUrl}/${id}`)
      .pipe(map(() => void 0));
  }

  getProjectStatus(id: string): Observable<boolean> {
    return this.http.get<projectResponse>(`${this.apiUrl}/${id}/status`)
      .pipe(map(response => (response.data as any).isFunded));
  }
  private buildQueryParams(options?: QueryOptions): any {
    if (!options) return {};
    
    const params: any = {};
    if (options.filter) params.filter = JSON.stringify(options.filter);
    if (options.sort) params.sort = options.sort;
    if (options.way) params.way = options.way;
    if (options.limit) params.limit = options.limit.toString();
    if (options.offset) params.offset = options.offset.toString();
    
    return params;
  }
}
