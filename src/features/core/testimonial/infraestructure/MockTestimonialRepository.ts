import { TestimonialRepository } from '../domain/TestimonialRepository';
import { Testimonial } from '../domain/Testimonial';
import { TestimonialId } from '../domain/value-objects/TestimonialId';
import {
  TestimonialStatus,
  TestimonialStatusEnum,
} from '../domain/value-objects/TestimonialStatus';

export class MockTestimonialRepository implements TestimonialRepository {
  private testimonials: Testimonial[] = [];

  async create(testimonial: Testimonial): Promise<void> {
    this.testimonials.push(testimonial);
    return Promise.resolve();
  }

  async findAll(search?: string): Promise<Testimonial[]> {
    if (!search) {
      return Promise.resolve(this.testimonials);
    }
    const lowerSearch = search.toLowerCase();
    const filtered = this.testimonials.filter(
      (t) =>
        t.content.value.toLowerCase().includes(lowerSearch) ||
        t.author.value.toLowerCase().includes(lowerSearch),
    );
    return Promise.resolve(filtered);
  }

  async findById(id: TestimonialId): Promise<Testimonial | null> {
    const testimonial = this.testimonials.find((t) => t.id.value === id.value);
    return Promise.resolve(testimonial || null);
  }

  async approve(id: TestimonialId): Promise<void> {
    const testimonial = this.testimonials.find((t) => t.id.value === id.value);
    if (testimonial) {
      testimonial.status = new TestimonialStatus(
        TestimonialStatusEnum.APPROVED,
      );
    }
    return Promise.resolve();
  }

  async findApproved(limit?: number): Promise<Testimonial[]> {
    const approved = this.testimonials.filter(
      (t) => t.status.value === TestimonialStatusEnum.APPROVED,
    );

    if (limit) {
      return Promise.resolve(approved.slice(0, limit));
    }
    return Promise.resolve(approved);
  }

  async update(id: TestimonialId, data: Partial<Testimonial>): Promise<void> {
    const index = this.testimonials.findIndex((t) => t.id.value === id.value);
    if (index !== -1) {
      // Use Object.assign to preserve prototype methods like toPrimitives()
      Object.assign(this.testimonials[index], data);
    }
    return Promise.resolve();
  }

  async remove(id: TestimonialId): Promise<void> {
    this.testimonials = this.testimonials.filter(
      (t) => t.id.value !== id.value,
    );
    return Promise.resolve();
  }
}
