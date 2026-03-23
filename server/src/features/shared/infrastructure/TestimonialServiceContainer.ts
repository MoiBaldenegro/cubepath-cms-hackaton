import { TestimonialRepository } from '../../core/testimonial/domain/TestimonialRepository';
import { TestimonialCreate } from '../../core/testimonial/application/createTestimonial/createTestimonial';
import { FindAllTestimonials } from '../../core/testimonial/application/findAllTestimonials/FindAllTestimonials';
import { FindTestimonialById } from '../../core/testimonial/application/findTestimonialById/FindTestimonialById';
import { RemoveTestimonial } from '../../core/testimonial/application/removeTestimonial/RemoveTestimonial';
import { UpdateTestimonial } from '../../core/testimonial/application/updateTestimonial/UpdateTestimonial';
import { ApproveTestimonial } from '../../core/testimonial/application/approveTestimonial/ApproveTestimonial';
import { FindApprovedTestimonials } from '../../core/testimonial/application/findApprovedTestimonials/FindApprovedTestimonials';

export class TestimonialServiceContainer {
  public readonly createTestimonial: TestimonialCreate;
  public readonly findAllTestimonials: FindAllTestimonials;
  public readonly findTestimonialById: FindTestimonialById;
  public readonly removeTestimonial: RemoveTestimonial;
  public readonly updateTestimonial: UpdateTestimonial;
  public readonly approveTestimonial: ApproveTestimonial;
  public readonly findApprovedTestimonials: FindApprovedTestimonials;

  constructor(repository: TestimonialRepository) {
    this.createTestimonial = new TestimonialCreate(repository);
    this.findAllTestimonials = new FindAllTestimonials(repository);
    this.findTestimonialById = new FindTestimonialById(repository);
    this.removeTestimonial = new RemoveTestimonial(repository);
    this.updateTestimonial = new UpdateTestimonial(repository);
    this.approveTestimonial = new ApproveTestimonial(repository);
    this.findApprovedTestimonials = new FindApprovedTestimonials(repository);
  }
}
