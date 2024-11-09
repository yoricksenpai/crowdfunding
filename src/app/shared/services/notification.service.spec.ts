// notification.service.spec.ts
import { TestBed } from '@angular/core/testing';
import { NotificationService } from './notification.service';
import { MessageService } from 'primeng/api';

describe('NotificationService', () => {
  let service: NotificationService;
  let messageService: MessageService;

  beforeEach(() => {
    const spy = jasmine.createSpyObj('MessageService', ['add', 'clear']);
    TestBed.configureTestingModule({
      providers: [
        NotificationService,
        { provide: MessageService, useValue: spy }
      ]
    });
    service = TestBed.inject(NotificationService);
    messageService = TestBed.inject(MessageService) as MessageService;
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('Project notifications', () => {
    it('should show project created notification', () => {
      service.projectCreated('Test Project');
      expect(messageService.add).toHaveBeenCalledWith({
        severity: 'success',
        summary: 'Projet créé avec succès',
        detail: 'Le projet "Test Project" a été créé et est maintenant visible par la communauté.',
        life: 4000
      });
    });

    it('should show project updated notification', () => {
      service.projectUpdated('Test Project');
      expect(messageService.add).toHaveBeenCalledWith({
        severity: 'success',
        summary: 'Projet mis à jour',
        detail: 'Les modifications du projet "Test Project" ont été enregistrées.',
        life: 4000
      });
    });

    it('should show project deleted notification', () => {
      service.projectDeleted('Test Project');
      expect(messageService.add).toHaveBeenCalledWith({
        severity: 'info',
        summary: 'Projet supprimé',
        detail: 'Le projet "Test Project" a été supprimé définitivement.',
        life: 5000
      });
    });
  });

  describe('Contribution notifications', () => {
    it('should show contribution success notification', () => {
      service.contributionSuccess(100, 'Test Project');
      expect(messageService.add).toHaveBeenCalledWith({
        severity: 'success',
        summary: 'Contribution réussie',
        detail: 'Votre contribution de 100€ au projet "Test Project" a été enregistrée. Merci pour votre soutien !',
        life: 4000
      });
    });

    it('should show contribution error notification', () => {
      service.contributionError();
      expect(messageService.add).toHaveBeenCalledWith({
        severity: 'error',
        summary: 'Erreur de contribution',
        detail: 'Une erreur est survenue lors du traitement de votre contribution. Veuillez réessayer.',
        life: 8000
      });
    });
  });

  describe('Generic notifications', () => {
    it('should show success notification', () => {
      service.showSuccess('Test message');
      expect(messageService.add).toHaveBeenCalledWith({
        severity: 'success',
        summary: 'Succès',
        detail: 'Test message',
        life: 4000
      });
    });

    it('should show error notification', () => {
      service.showError('Test message');
      expect(messageService.add).toHaveBeenCalledWith({
        severity: 'error',
        summary: 'Erreur',
        detail: 'Test message',
        life: 8000
      });
    });

    it('should show warning notification', () => {
      service.showWarning('Test message');
      expect(messageService.add).toHaveBeenCalledWith({
        severity: 'warning',
        summary: 'Attention',
        detail: 'Test message',
        life: 6000
      });
    });

    it('should clear all notifications', () => {
      service.clearAll();
      expect(messageService.clear).toHaveBeenCalled();
    });
  });
});