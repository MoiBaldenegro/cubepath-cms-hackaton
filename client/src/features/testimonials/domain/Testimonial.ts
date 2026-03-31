export const TestimonialStatus = {
  PENDING: 'PENDING',
  APPROVED: 'APPROVED',
  REJECTED: 'REJECTED',
} as const;
export type TestimonialStatus = (typeof TestimonialStatus)[keyof typeof TestimonialStatus];

export const TestimonialCategory = {
  TECHNOLOGY: 'TECHNOLOGY',
  HEALTHCARE: 'HEALTHCARE',
  EDUCATION: 'EDUCATION',
  FINANCE: 'FINANCE',
  ENTERTAINMENT: 'ENTERTAINMENT',
} as const;
export type TestimonialCategory = (typeof TestimonialCategory)[keyof typeof TestimonialCategory];

export const TestimonialTag = {
  PRODUCT: 'PRODUCT',
  SERVICE: 'SERVICE',
  SUPPORT: 'SUPPORT',
} as const;
export type TestimonialTag = (typeof TestimonialTag)[keyof typeof TestimonialTag];

export interface Testimonial {
  id: string;
  organizationId: string;
  iKey: string;
  author: string;
  content: string;
  status: TestimonialStatus;
  tags: TestimonialTag[];
  rating: number;
  category: TestimonialCategory;
  imageUrl?: string;
  videoUrl?: string;
  isEdited?: boolean;
  createdAt?: Date | string;
  updatedAt?: Date | string;
  aiGenerated?: boolean; // Indica si es generado por AI
}