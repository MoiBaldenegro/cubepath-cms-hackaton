import { TestimonialRepository } from '../../domain/TestimonialRepository';
import { ApproveTestimonialRequest } from './ApproveTestimonialRequest';
import { TestimonialId } from '../../domain/value-objects/TestimonialId';
import { TestimonialNotFoundError } from '../../domain/errors/TestimonialNotFoundError';

export class ApproveTestimonial {
  constructor(private repository: TestimonialRepository) {}

  async run(request: ApproveTestimonialRequest): Promise<void> {
    const id = new TestimonialId(request.id);

    const existingTestimonial = await this.repository.findById(id);
    if (!existingTestimonial) {
      throw new TestimonialNotFoundError(request.id);
    }

    await this.repository.approve(id);
  }
}
