import { TestimonialRepository } from '../../domain/TestimonialRepository';
import { FindAllTestimonialsRequest } from './FindAllTestimonialsRequest';
import { Testimonial } from '../../domain/Testimonial';

export class FindAllTestimonials {
  constructor(private repository: TestimonialRepository) {}

  async run(request: FindAllTestimonialsRequest = {}): Promise<Testimonial[]> {
    const testimonials = await this.repository.findAll(request.search);

    return testimonials;
  }
}
