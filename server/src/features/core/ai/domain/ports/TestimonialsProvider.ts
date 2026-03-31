import { Testimonial } from 'src/features/core/testimonial/domain/Testimonial';
import { OrganizationId } from 'src/features/core/testimonial/domain/value-objects/OrganizationId';

export interface TestimonialsProvider {
  getApprovedByOrganization(
    organizationId: OrganizationId,
  ): Promise<Testimonial[]>;
}
