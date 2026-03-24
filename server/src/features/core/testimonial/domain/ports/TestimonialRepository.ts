import { Testimonial } from '../Testimonial';
import { TestimonialId } from '../value-objects/TestimonialId';
import { OrganizationId } from '../value-objects/OrganizationId';

// ports
export interface TestimonialRepository {
  create(testimonial: Testimonial): Promise<void>;
  findAll(organizationId: OrganizationId, search?: string): Promise<Testimonial[]>;
  approve(id: TestimonialId): Promise<void>;
  findById(id: TestimonialId): Promise<Testimonial | null>;
  findApproved(limit?: number): Promise<Testimonial[]>;
  findApprovedByOrganization(organizationId: OrganizationId): Promise<Testimonial[]>;
  update(id: TestimonialId, data: Partial<Testimonial>): Promise<void>;
  remove(id: TestimonialId): Promise<void>;
}
