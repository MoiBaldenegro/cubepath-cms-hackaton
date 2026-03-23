import { TestimonialRepository } from '../domain/TestimonialRepository';
import { Testimonial } from '../domain/Testimonial';
import { TestimonialId } from '../domain/value-objects/TestimonialId';
import {
  TestimonialStatus,
  TestimonialStatusEnum,
} from '../domain/value-objects/TestimonialStatus';

export class InMemoryTestimonialRepository implements TestimonialRepository {
  private testimonials: Testimonial[] = [];

  async create(testimonial: Testimonial): Promise<void> {
    this.testimonials.push(testimonial);
  }

  async findAll(search?: string): Promise<Testimonial[]> {
    if (!search) {
      return this.testimonials;
    }
    const lowerSearch = search.toLowerCase();
    return this.testimonials.filter(
      (t) =>
        t.content.value.toLowerCase().includes(lowerSearch) ||
        t.author.value.toLowerCase().includes(lowerSearch),
    );
  }

  async findById(id: TestimonialId): Promise<Testimonial | null> {
    return this.testimonials.find((t) => t.id.value === id.value) || null;
  }

  async approve(id: TestimonialId): Promise<void> {
    const testimonial = this.testimonials.find((t) => t.id.value === id.value);
    if (testimonial) {
      testimonial.status = new TestimonialStatus(
        TestimonialStatusEnum.APPROVED,
      );
    }
  }

  async findApproved(limit?: number): Promise<Testimonial[]> {
    const approved = this.testimonials.filter(
      (t) => t.status.value === TestimonialStatusEnum.APPROVED,
    );
    return limit ? approved.slice(0, limit) : approved;
  }

  async update(id: TestimonialId, data: Partial<Testimonial>): Promise<void> {
    const index = this.testimonials.findIndex((t) => t.id.value === id.value);
    if (index !== -1) {
      Object.assign(this.testimonials[index], data);
    }
  }

  async remove(id: TestimonialId): Promise<void> {
    this.testimonials = this.testimonials.filter(
      (t) => t.id.value !== id.value,
    );
  }
}
