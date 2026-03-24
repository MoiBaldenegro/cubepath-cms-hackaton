import { TestimonialStatus, TestimonialCategory, TestimonialTag, type Testimonial } from "../domain/Testimonial";
import { config } from '../../../shared/infrastructure/config';

const API_URL = config.VITE_API_URL;

const MOCK_TESTIMONIALS: any[] = [
  {
    id: '1',
    iKey: 'demo-ikey-1',
    author: 'Alice Johnson',
    content: 'CubePath has transformed how we gather feedback. Absolutely essential tool.',
    rating: 5,
    imageUrl: 'https://i.pravatar.cc/150?u=alice',
    status: TestimonialStatus.APPROVED,
    category: TestimonialCategory.TECHNOLOGY,
    tags: [TestimonialTag.PRODUCT],
    organizationId: 'demo-org-id',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    isEdited: false
  },
  {
    id: '2', 
    iKey: 'demo-ikey-2',
    author: 'Bob Smith',
    content: 'Easy to install and looks great on our landing page. Highly recommended!',
    rating: 4,
    imageUrl: 'https://i.pravatar.cc/150?u=bob',
    status: TestimonialStatus.PENDING,
    category: TestimonialCategory.EDUCATION,
    tags: [TestimonialTag.SERVICE],
    organizationId: 'demo-org-id',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(), 
    isEdited: false
  },
  {
    id: '3',
    iKey: 'demo-ikey-3',
    author: 'Charlie Brown',
    content: 'The API is clean and the documentation is top notch. A developer\'s dream.',
    rating: 5,
    imageUrl: 'https://i.pravatar.cc/150?u=charlie', 
    status: TestimonialStatus.APPROVED,
    category: TestimonialCategory.TECHNOLOGY,
    tags: [TestimonialTag.SUPPORT],
    organizationId: 'demo-org-id',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    isEdited: false
  }
];

export class TestimonialService {
  private static async request<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
    const token = localStorage.getItem('token');
    
    // MOCK MODE for DEMO USER
    if (token === 'demo-token') {
       // Simulate network delay
       await new Promise(resolve => setTimeout(resolve, 600));
       
       if (options.method === 'POST') return {} as T;
       if (options.method === 'PATCH') return {} as T;
       if (options.method === 'DELETE') return {} as T;
       if (endpoint.includes('approved')) return MOCK_TESTIMONIALS.filter(t => t.status === TestimonialStatus.APPROVED) as unknown as T;
       
       return MOCK_TESTIMONIALS as unknown as T;
    }

    const headers = {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...options.headers,
    };

    const response = await fetch(`${API_URL}/${endpoint}`, {
      ...options,
      headers,
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.message || 'API Error');
    }

    if (response.status === 204) {
      return {} as T;
    }

    return response.json().catch(() => ({} as T));
  }

  static async findAll(): Promise<Testimonial[]> {
    return this.request<Testimonial[]>('testimonial');
  }

  static async findApproved(): Promise<Testimonial[]> {
    return this.request<Testimonial[]>('testimonial/approved');
  }

  static async create(data: Omit<Testimonial, 'id' | 'createdAt' | 'updatedAt' | 'isEdited' | 'organizationId' | 'status'>): Promise<void> {
    return this.request<void>('testimonial', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  static async approve(id: string): Promise<void> {
    return this.request<void>(`testimonial/${id}/approve`, {
      method: 'PATCH',
    });
  }

  static async remove(id: string): Promise<void> {
    return this.request<void>(`testimonial/${id}`, {
      method: 'DELETE',
    });
  }
}