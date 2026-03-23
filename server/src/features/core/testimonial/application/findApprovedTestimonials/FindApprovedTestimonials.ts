import { TestimonialRepository } from '../../domain/TestimonialRepository';
import { FindApprovedTestimoniaRequest } from './FindApprovedTestimoniaRequest';
import { Testimonial } from '../../domain/Testimonial';

export class FindApprovedTestimonials {
  constructor(private repository: TestimonialRepository) {}

  async run(
    request: FindApprovedTestimoniaRequest = {},
  ): Promise<Testimonial[]> {
    const testimonials = await this.repository.findApproved(request.limit);

    return testimonials;
  }
}
