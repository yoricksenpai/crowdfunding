import { Injectable } from '@angular/core';
import { MessageService } from 'primeng/api';

export type NotificationType = 'success' | 'error' | 'info' | 'warning';

@Injectable({
  providedIn: 'root'
})
export class NotificationService {
  constructor(private messageService: MessageService) {}

  private getDuration(type: NotificationType): number {
    switch (type) {
      case 'error':
        return 8000; // Plus long pour les erreurs importantes
      case 'warning':
        return 6000; // Durée moyenne pour les avertissements
      case 'success':
        return 4000; // Court pour les succès
      default:
        return 5000;
    }
  }

  // Méthodes pour les projets
  projectCreated(projectName: string): void {
    this.messageService.add({
      severity: 'success',
      summary: 'Projet créé avec succès',
      detail: `Le projet "${projectName}" a été créé et est maintenant visible par la communauté.`,
      life: this.getDuration('success')
    });
  }

  projectUpdated(projectName: string): void {
    this.messageService.add({
      severity: 'success',
      summary: 'Projet mis à jour',
      detail: `Les modifications du projet "${projectName}" ont été enregistrées.`,
      life: this.getDuration('success')
    });
  }

  projectDeleted(projectName: string): void {
    this.messageService.add({
      severity: 'info',
      summary: 'Projet supprimé',
      detail: `Le projet "${projectName}" a été supprimé définitivement.`,
      life: this.getDuration('info')
    });
  }

  // Méthodes pour les contributions
  contributionSuccess(amount: number, projectName: string): void {
    this.messageService.add({
      severity: 'success',
      summary: 'Contribution réussie',
      detail: `Votre contribution de ${amount}€ au projet "${projectName}" a été enregistrée. Merci pour votre soutien !`,
      life: this.getDuration('success')
    });
  }

  contributionError(): void {
    this.messageService.add({
      severity: 'error',
      summary: 'Erreur de contribution',
      detail: 'Une erreur est survenue lors du traitement de votre contribution. Veuillez réessayer.',
      life: this.getDuration('error')
    });
  }

  projectGoalReached(projectName: string): void {
    this.messageService.add({
      severity: 'success',
      summary: 'Objectif atteint ! 🎉',
      detail: `Le projet "${projectName}" a atteint son objectif de financement ! Les contributions sont maintenant clôturées.`,
      life: this.getDuration('success')
    });
  }

  // Méthodes pour la validation
  invalidFormError(): void {
    this.messageService.add({
      severity: 'error',
      summary: 'Formulaire incomplet',
      detail: `Veuillez remplir tous les champs obligatoires du formulaire de donation.`,
      life: this.getDuration('error')
    });
  }

  uploadError(): void {
    this.messageService.add({
      severity: 'error',
      summary: 'Erreur de téléchargement',
      detail: "Une erreur est survenue lors du téléchargement de l'image. Veuillez réessayer.",
      life: this.getDuration('error')
    });
  }

  // Méthodes génériques
  showSuccess(message: string): void {
    this.messageService.add({
      severity: 'success',
      summary: 'Succès',
      detail: message,
      life: this.getDuration('success')
    });
  }

  showError(message: string): void {
    this.messageService.add({
      severity: 'error',
      summary: 'Erreur',
      detail: message,
      life: this.getDuration('error')
    });
  }

  showWarning(message: string): void {
    this.messageService.add({
      severity: 'warning',
      summary: 'Attention',
      detail: message,
      life: this.getDuration('warning')
    });
  }

  showInfo(message: string): void {
    this.messageService.add({
      severity: 'info',
      summary: 'Information',
      detail: message,
      life: this.getDuration('info')
    });
  }

  // Méthode pour effacer toutes les notifications
  clearAll(): void {
    this.messageService.clear();
  }
}