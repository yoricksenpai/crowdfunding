// models/comment.model.ts
export interface Comment {
    id: string;
    projectId: string;
    contributorIp: string;
    content: string;
    createdAt: Date;
    contributionAmount: number; // Montant de la contribution du commentateur
  }