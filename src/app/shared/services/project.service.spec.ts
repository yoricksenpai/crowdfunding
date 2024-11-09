// project.service.spec.ts
import { TestBed } from '@angular/core/testing';
import { ProjectService } from './project.service';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { Project, projectResponse, QueryOptions } from '../models';

describe('ProjectService', () => {
  let service: ProjectService;
  let httpMock: HttpTestingController;
  const apiUrl = 'http://localhost:3000/api/v1/projects';

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [ProjectService]
    });
    service = TestBed.inject(ProjectService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  const mockProject: Project = {
    id: '1',
    title: 'Test Project',
    description: 'Test Description',
    goal: 1000,
    raised: 0
  };

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('getProjects', () => {
    it('should retrieve projects without options', () => {
      const mockResponse: projectResponse = {
        status: 200,
        message: 'Projects retrieved successfully',
        data: [{
          id: '1',
          title: 'Test Project',
          description: 'Test Description',
          goal: 1000,
          raised: 0
        }]
      };

      service.getProjects().subscribe(projects => {
        expect(projects.length).toBe(1);
        expect(projects[0]).toEqual(mockProject);
      });

      const req = httpMock.expectOne(apiUrl);
      expect(req.request.method).toBe('GET');
      req.flush(mockResponse);
    });

    it('should retrieve projects with query options', () => {
      const options: QueryOptions = {
        filter: { title: 'Test' },
        sort: 'title',
        way: 'asc',
        limit: 10,
        offset: 0
      };

      const mockResponse: projectResponse = {
        status: 200,
        message: 'Projects retrieved successfully',
        data: [mockProject]
      };

      service.getProjects(options).subscribe(projects => {
        expect(projects.length).toBe(1);
      });

      const req = httpMock.expectOne(
        `${apiUrl}?filter=${JSON.stringify(options.filter)}&sort=title&way=asc&limit=10&offset=0`
      );
      expect(req.request.method).toBe('GET');
      req.flush(mockResponse);
    });
  });

  describe('getProject', () => {
    it('should retrieve a single project', () => {
      const mockResponse: projectResponse = {
        status: 200,
        message: 'Project retrieved successfully',
        data: mockProject
      };

      service.getProject('1').subscribe(project => {
        expect(project).toEqual(mockProject);
      });

      const req = httpMock.expectOne(`${apiUrl}/1`);
      expect(req.request.method).toBe('GET');
      req.flush(mockResponse);
    });

    it('should handle project not found', () => {
      const mockErrorResponse: projectResponse = {
        status: 404,
        message: 'Project not found',
        data: null as any
      };

      service.getProject('999').subscribe({
        error: (error) => {
          expect(error.status).toBe(404);
          expect(error.message).toBe('Project not found');
        }
      });

      const req = httpMock.expectOne(`${apiUrl}/999`);
      expect(req.request.method).toBe('GET');
      req.flush(mockErrorResponse, { status: 404, statusText: 'Not Found' });
    });
  });

  describe('createProject', () => {
    it('should create a new project', () => {
      const newProject = {
        title: 'New Project',
        description: 'New Description',
        goal: 2000
      };
      const mockResponse: projectResponse = {
        status: 201,
        message: 'Project created successfully',
        data: { ...newProject, id: '2', raised: 0 }
      };

      service.createProject(newProject).subscribe(project => {
        expect(project).toEqual(mockResponse.data as Project);
      });

      const req = httpMock.expectOne(apiUrl);
      expect(req.request.method).toBe('POST');
      expect(req.request.body).toEqual(newProject);
      req.flush(mockResponse);
    });

    it('should handle validation errors during creation', () => {
      const invalidProject = {
        title: '', // Invalid empty title
        description: 'Test Description',
        goal: 2000
      };
      const mockErrorResponse: projectResponse = {
        status: 400,
        message: 'Validation failed',
        data: null as any
      };

      service.createProject(invalidProject).subscribe({
        error: (error) => {
          expect(error.status).toBe(400);
          expect(error.message).toBe('Validation failed');
        }
      });

      const req = httpMock.expectOne(apiUrl);
      expect(req.request.method).toBe('POST');
      req.flush(mockErrorResponse, { status: 400, statusText: 'Bad Request' });
    });
  });

  describe('updateProject', () => {
    it('should update an existing project', () => {
      const updateData = { title: 'Updated Title' };
      const mockResponse: projectResponse = {
        status: 200,
        message: 'Project updated successfully',
        data: { ...mockProject, ...updateData }
      };

      service.updateProject('1', updateData).subscribe(project => {
        expect(project.title).toBe('Updated Title');
      });

      const req = httpMock.expectOne(`${apiUrl}/1`);
      expect(req.request.method).toBe('PUT');
      expect(req.request.body).toEqual(updateData);
      req.flush(mockResponse);
    });
  });

  describe('deleteProject', () => {
    it('should delete a project', () => {
      const mockResponse: projectResponse = {
        status: 200,
        message: 'Project deleted successfully',
        data: null as any
      };

      service.deleteProject('1').subscribe(response => {
        expect(response).toBeUndefined();
      });

      const req = httpMock.expectOne(`${apiUrl}/1`);
      expect(req.request.method).toBe('DELETE');
      req.flush(mockResponse);
    });
  });

  describe('getProjectStatus', () => {
    it('should get project funding status', () => {
      const mockResponse: projectResponse = {
        status: 200,
        message: 'Project status retrieved successfully',
        data: { 
          id: '1',
          goal: 1000,
          raised: 1000,  // Montant atteint pour que isFunded soit cohérent
          title: 'Test Project',
          description: 'Test Description'
        }
      };

      service.getProjectStatus('1').subscribe(status => {
        expect(status).toBe(true); // Le status est true car raised === goal
      });

      const req = httpMock.expectOne(`${apiUrl}/1/status`);
      expect(req.request.method).toBe('GET');
      req.flush(mockResponse);
    });

    it('should return false when project goal is not reached', () => {
      const mockResponse: projectResponse = {
        status: 200,
        message: 'Project status retrieved successfully',
        data: { 
          id: '1',
          goal: 1000,
          raised: 500,  // Montant non atteint
          title: 'Test Project',
          description: 'Test Description'
        }
      };

      service.getProjectStatus('1').subscribe(status => {
        expect(status).toBe(false);
      });

      const req = httpMock.expectOne(`${apiUrl}/1/status`);
      expect(req.request.method).toBe('GET');
      req.flush(mockResponse);
    });

    it('should handle error when getting project status', () => {
      const mockErrorResponse: projectResponse = {
        status: 404,
        message: 'Project not found',
        data: null as any
      };

      service.getProjectStatus('999').subscribe({
        error: (error) => {
          expect(error.status).toBe(404);
          expect(error.message).toBe('Project not found');
        }
      });

      const req = httpMock.expectOne(`${apiUrl}/999/status`);
      expect(req.request.method).toBe('GET');
      req.flush(mockErrorResponse, { status: 404, statusText: 'Not Found' });
    });
  });
});