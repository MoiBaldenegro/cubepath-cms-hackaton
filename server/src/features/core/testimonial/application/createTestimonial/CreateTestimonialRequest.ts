export interface CreateTestimonialRequest {
  iKey: string;
  content: string;
  author: string;
  tags: string[];
  rating: number;
  category: string;
  organizationId: string;
  imageUrl?: string;
  videoUrl?: string;
}
