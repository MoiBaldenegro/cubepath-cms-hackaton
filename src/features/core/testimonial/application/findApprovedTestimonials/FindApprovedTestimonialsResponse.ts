export interface FindApprovedTestimonialsResponse {
  id: string;
  iKey: string;
  content: string;
  author: string;
  status: string;
  tags: string[];
  rating: number;
  category: string;
  isEdited: boolean;
  imageUrl?: string;
  videoUrl?: string;
  createdAt?: Date;
  updatedAt?: Date;
}
