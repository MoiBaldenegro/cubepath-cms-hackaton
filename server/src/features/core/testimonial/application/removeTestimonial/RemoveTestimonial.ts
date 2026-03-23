import { RemoveTestimonialRequest } from './RemoveTestimonialRequest';
import { TestimonialId } from '../../domain/value-objects/TestimonialId';
import { TestimonialNotFoundError } from '../../domain/errors/TestimonialNotFoundError';
import { TestimonialRepository } from '../../domain/ports/TestimonialRepository';

export class RemoveTestimonial {
  constructor(private repository: TestimonialRepository) {}

  async run(request: RemoveTestimonialRequest): Promise<void> {
    const id = new TestimonialId(request.id);

    const existingTestimonial = await this.repository.findById(id);
    if (!existingTestimonial) {
      throw new TestimonialNotFoundError(request.id);
    }

    await this.repository.remove(id);
  }
}
