import { TestimonialCreate } from '../../core/testimonial/application/createTestimonial/createTestimonial';
import { FindAllTestimonials } from '../../core/testimonial/application/findAllTestimonials/FindAllTestimonials';
import { FindTestimonialById } from '../../core/testimonial/application/findTestimonialById/FindTestimonialById';
import { RemoveTestimonial } from '../../core/testimonial/application/removeTestimonial/RemoveTestimonial';
import { UpdateTestimonial } from '../../core/testimonial/application/updateTestimonial/UpdateTestimonial';
import { ApproveTestimonial } from '../../core/testimonial/application/approveTestimonial/ApproveTestimonial';
import { FindApprovedTestimonials } from '../../core/testimonial/application/findApprovedTestimonials/FindApprovedTestimonials';
import { TestimonialRepository } from 'src/features/core/testimonial/domain/ports/TestimonialRepository';
import { UploadImageUseCase } from 'src/features/media/application/UploadImageUseCase';
import { MediaRepository } from 'src/features/media/domain/MediaRepository';

export class TestimonialServiceContainer {
  public readonly createTestimonial: TestimonialCreate;
  public readonly findAllTestimonials: FindAllTestimonials;
  public readonly findTestimonialById: FindTestimonialById;
  public readonly removeTestimonial: RemoveTestimonial;
  public readonly updateTestimonial: UpdateTestimonial;
  public readonly approveTestimonial: ApproveTestimonial;
  public readonly findApprovedTestimonials: FindApprovedTestimonials;
  public readonly uploadImage: UploadImageUseCase;

  constructor(
    repository: TestimonialRepository,
    mediaRepository: MediaRepository,
  ) {
    this.createTestimonial = new TestimonialCreate(repository);
    this.findAllTestimonials = new FindAllTestimonials(repository);
    this.findTestimonialById = new FindTestimonialById(repository);
    this.removeTestimonial = new RemoveTestimonial(repository);
    this.updateTestimonial = new UpdateTestimonial(repository);
    this.approveTestimonial = new ApproveTestimonial(repository);
    this.findApprovedTestimonials = new FindApprovedTestimonials(repository);
    this.uploadImage = new UploadImageUseCase(mediaRepository);
  }
}
