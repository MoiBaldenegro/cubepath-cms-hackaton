import { FindTestimonialByIdRequest } from './FindTestimonialByIdRequest';
import { Testimonial } from '../../domain/Testimonial';
import { TestimonialId } from '../../domain/value-objects/TestimonialId';
import { TestimonialNotFoundError } from '../../domain/errors/TestimonialNotFoundError';
import { TestimonialRepository } from '../../domain/ports/TestimonialRepository';

export class FindTestimonialById {
  constructor(private repository: TestimonialRepository) {}

  async run(request: FindTestimonialByIdRequest): Promise<Testimonial> {
    const id = new TestimonialId(request.id);
    const testimonial = await this.repository.findById(id);

    if (!testimonial) {
      throw new TestimonialNotFoundError(request.id);
    }

    return testimonial;
  }
}
