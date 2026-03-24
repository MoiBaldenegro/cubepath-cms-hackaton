export enum TestimonialStatus {
  PENDING = 'PENDING',
  APPROVED = 'APPROVED',
  REJECTED = 'REJECTED',
}

export enum TestimonialCategory {
  TECHNOLOGY = 'TECHNOLOGY',
  HEALTHCARE = 'HEALTHCARE',
  EDUCATION = 'EDUCATION',
  FINANCE = 'FINANCE',
  ENTERTAINMENT = 'ENTERTAINMENT',
}

export enum TestimonialTag {
  PRODUCT = 'PRODUCT',
  SERVICE = 'SERVICE',
  SUPPORT = 'SUPPORT',
}

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
}