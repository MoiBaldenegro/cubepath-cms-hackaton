import { FindAllTestimonialsRequest } from './FindAllTestimonialsRequest';
import { Testimonial } from '../../domain/Testimonial';
import { TestimonialRepository } from '../../domain/ports/TestimonialRepository';
import { OrganizationId } from '../../domain/value-objects/OrganizationId';

export class FindAllTestimonials {
  constructor(private repository: TestimonialRepository) {}

  async run(request: FindAllTestimonialsRequest): Promise<Testimonial[]> {
    const testimonials = await this.repository.findAll(new OrganizationId(request.organizationId), request.search);

    return testimonials;
  }
}
