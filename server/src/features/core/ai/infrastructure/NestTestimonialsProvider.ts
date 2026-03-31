import { Injectable, Inject } from '@nestjs/common';
import { TestimonialsProvider } from '../domain/ports/TestimonialsProvider';
import { OrganizationId } from '../../testimonial/domain/value-objects/OrganizationId';
import { Testimonial } from '../../testimonial/domain/Testimonial';
import type { TestimonialRepository } from '../../testimonial/domain/ports/TestimonialRepository';

@Injectable()
export class NestTestimonialsProvider implements TestimonialsProvider {
  constructor(
    @Inject('TestimonialRepository')
    private readonly testimonialRepository: TestimonialRepository,
  ) {}

  async getApprovedByOrganization(
    organizationId: OrganizationId,
  ): Promise<Testimonial[]> {
    return this.testimonialRepository.findApprovedByOrganization(
      organizationId,
    );
  }
}
