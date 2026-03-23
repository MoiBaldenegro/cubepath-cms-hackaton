import { FindAllTestimonialsRequest } from './FindAllTestimonialsRequest';
import { Testimonial } from '../../domain/Testimonial';
import { TestimonialRepository } from '../../domain/ports/TestimonialRepository';

export class FindAllTestimonials {
  constructor(private repository: TestimonialRepository) {}

  async run(request: FindAllTestimonialsRequest = {}): Promise<Testimonial[]> {
    const testimonials = await this.repository.findAll(request.search);

    return testimonials;
  }
}
