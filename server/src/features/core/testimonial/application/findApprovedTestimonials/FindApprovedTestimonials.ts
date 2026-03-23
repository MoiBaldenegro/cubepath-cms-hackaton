import { TestimonialRepository } from '../../domain/ports/TestimonialRepository';
import { Testimonial } from '../../domain/Testimonial';
import { FindApprovedTestimonialRequest } from './FindApprovedTestimonialRequest';

export class FindApprovedTestimonials {
  constructor(private repository: TestimonialRepository) {}

  async run(
    request: FindApprovedTestimonialRequest = {},
  ): Promise<Testimonial[]> {
    const testimonials = await this.repository.findApproved(request.limit);

    return testimonials;
  }
}
