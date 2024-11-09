// contribution.service.spec.ts
import { TestBed } from '@angular/core/testing';
import { ContributionService } from './contribution.service';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { Project, projectResponse, Contribution } from '../models';
describe('ContributionService', () => {
  let service: ContributionService;
  let httpMock: HttpTestingController;
  const apiUrl = 'http://localhost:3000/api/v1/projects';

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [ContributionService]
    });
    service = TestBed.inject(ContributionService);
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
    raised: 500
  };

  describe('contribute', () => {
    it('should make a contribution to a project', () => {
      const contribution: Contribution = { raised: 100 };
      const mockResponse: projectResponse = {
        status: 200,
        message: 'Contribution successful',
        data: { ...mockProject, raised: 600 }
      };

      service.contribute('1', contribution).subscribe(project => {
        expect(project.raised).toBe(600);
      });

      const req = httpMock.expectOne(`${apiUrl}/1/contribute`);
      expect(req.request.method).toBe('POST');
      expect(req.request.body).toEqual(contribution);
      req.flush(mockResponse);
    });

    it('should handle failed contribution', () => {
      const invalidContribution: Contribution = { raised: -100 };
      const mockErrorResponse: projectResponse = {
        status: 400,
        message: 'Invalid contribution amount',
        data: null as any
      };

      service.contribute('1', invalidContribution).subscribe({
        error: (error) => {
          expect(error.status).toBe(400);
          expect(error.message).toBe('Invalid contribution amount');
        }
      });

      const req = httpMock.expectOne(`${apiUrl}/1/contribute`);
      expect(req.request.method).toBe('POST');
      req.flush(mockErrorResponse, { status: 400, statusText: 'Bad Request' });
    });
  });

  describe('validateContribution', () => {
    it('should validate contribution amount is greater than 0', () => {
      const result = service.validateContribution(mockProject, 0);
      expect(result.valid).toBe(false);
      expect(result.message).toBe('La contribution doit être supérieure à 0');
    });

    it('should validate contribution does not exceed remaining goal', () => {
      const result = service.validateContribution(mockProject, 600);
      expect(result.valid).toBe(false);
      expect(result.message).toBe('La contribution ne peut pas dépasser le montant restant (500€)');
    });

    it('should validate project has not reached its goal', () => {
      const fullProject = { ...mockProject, raised: 1000 };
      const result = service.validateContribution(fullProject, 100);
      expect(result.valid).toBe(false);
      expect(result.message).toBe('Ce projet a déjà atteint son objectif');
    });

    it('should validate valid contribution', () => {
      const result = service.validateContribution(mockProject, 100);
      expect(result.valid).toBe(true);
      expect(result.message).toBeUndefined();
    });
  });
});