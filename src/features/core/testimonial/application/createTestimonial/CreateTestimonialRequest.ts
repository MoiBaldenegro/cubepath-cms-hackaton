export interface CreateTestimonialRequest {
  iKey: string;
  content: string;
  author: string;
  tags: string[];
  rating: number;
  category: string;
  imageUrl?: string;
  videoUrl?: string;
}
