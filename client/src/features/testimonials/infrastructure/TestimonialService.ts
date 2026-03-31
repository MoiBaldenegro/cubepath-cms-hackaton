
import { TestimonialStatus, TestimonialCategory, TestimonialTag, type Testimonial } from "../domain/Testimonial";
import { config } from '../../../shared/infrastructure/config';

export async function findTestimonialById(id: string): Promise<Testimonial | null> {
  return TestimonialService.findById(id);
}

const API_URL = config.VITE_API_URL;

const DEFAULT_MOCK_TESTIMONIALS: Testimonial[] = [
  {
    id: '1',
    iKey: 'demo-ikey-1',
    author: 'Alice Johnson',
    content: 'Testimo has transformed how we gather feedback. Absolutely essential tool.',
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

const getDemoTestimonials = (): Testimonial[] => {
  const stored = localStorage.getItem('demo_testimonials');
  if (stored) {
    return JSON.parse(stored);
  }
  localStorage.setItem('demo_testimonials', JSON.stringify(DEFAULT_MOCK_TESTIMONIALS));
  return DEFAULT_MOCK_TESTIMONIALS;
};

const saveDemoTestimonials = (testimonials: Testimonial[]) => {
  localStorage.setItem('demo_testimonials', JSON.stringify(testimonials));
};

export class TestimonialService {
  static async findById(id: string): Promise<Testimonial | null> {
    // MOCK MODE
    const token = localStorage.getItem('token');
    if (token === 'demo-token') {
      const testimonials = getDemoTestimonials();
      return testimonials.find(t => t.id === id) || null;
    }
    return this.request<Testimonial>(`testimonial/${id}`);
  }
  private static async request<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
    const token = localStorage.getItem('token');
    
    // MOCK MODE for DEMO USER
    if (token === 'demo-token') {
       // Simulate network delay
       await new Promise(resolve => setTimeout(resolve, 600));
       
       const currentTestimonials = getDemoTestimonials();

       if (options.method === 'POST') {
           const body = JSON.parse(options.body as string);
           const newTestimonial = {
               ...body,
               id: Math.random().toString(36).substr(2, 9),
               status: body.status || TestimonialStatus.PENDING,
               organizationId: 'demo-org-id',
               createdAt: new Date().toISOString(),
               updatedAt: new Date().toISOString(),
               isEdited: false
           };
           currentTestimonials.push(newTestimonial);
           saveDemoTestimonials(currentTestimonials);
           return {} as T;
       }

       if (options.method === 'PATCH' && endpoint.includes('/approve')) {
           const id = endpoint.split('/')[1];
           const updated = currentTestimonials.map(t => 
             t.id === id ? { ...t, status: TestimonialStatus.APPROVED } : t
           );
           saveDemoTestimonials(updated);
           return {} as T;
       }

       if (options.method === 'DELETE') {
           const id = endpoint.split('/')[1];
           const filtered = currentTestimonials.filter(t => t.id !== id);
           saveDemoTestimonials(filtered);
           return {} as T;
       }

       if (endpoint.includes('approved')) {
         return currentTestimonials.filter(t => t.status === TestimonialStatus.APPROVED) as unknown as T;
       }
       
       return currentTestimonials as unknown as T;
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

  static async create(data: Omit<Testimonial, 'id' | 'createdAt' | 'updatedAt' | 'isEdited' | 'organizationId' | 'status'> & { imageFile?: File | null }): Promise<void> {
  const token = localStorage.getItem('token');

  if (data.imageFile) {
    const formData = new FormData();
    formData.append('author', data.author);
    formData.append('content', data.content);
    formData.append('rating', String(data.rating)); // Se queda como string, lo arreglamos en el DTO
    formData.append('category', data.category);
    formData.append('iKey', data.iKey);

    // ✅ CORRECCIÓN 1: Mandar tags uno por uno
    // NestJS recolecta múltiples appends con la misma llave y los vuelve un array
    data.tags.forEach(tag => {
      formData.append('tags', tag); 
    });

    if (data.videoUrl) formData.append('videoUrl', data.videoUrl);
    formData.append('image', data.imageFile);

    return fetch(`${API_URL}/testimonial`, {
      method: 'POST',
      headers: {
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
        // IMPORTANTE: NO pongas 'Content-Type': 'application/json' ni 'multipart/form-data'
        // El navegador lo pone solo con el "boundary" necesario
      },
      body: formData,
    }).then(async (res) => {
      if (!res.ok) {
        const errorData = await res.json().catch(() => ({}));
        throw new Error(errorData.message || 'API Error');
      }
    });
  } else {
    // Modo JSON (aquí no hay bronca con los tipos)
    return this.request<void>('testimonial', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }
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

  static async getSummary(): Promise<{ summary: string }> {
    // MOCK MODE
    const token = localStorage.getItem('token');
    if (token === 'demo-token') {
      await new Promise(resolve => setTimeout(resolve, 800));
      return { summary: 'Este es un resumen generado por IA de los testimonios más relevantes.' };
    }
    return this.request<{ summary: string }>('testimonial/summary');
  }
}