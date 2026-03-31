import { AISummaryService } from '../domain/ports/AISummaryService';
import { TestimonialsProvider } from '../domain/ports/TestimonialsProvider';
import { OrganizationId } from '../../testimonial/domain/value-objects/OrganizationId';

export class SummarizeTestimonialsUseCase {
  constructor(
    private readonly aiSummaryService: AISummaryService,
    private readonly testimonialsProvider: TestimonialsProvider,
  ) {}

  async execute(organizationId: string): Promise<string> {
    const orgId = new OrganizationId(organizationId);
    const testimonials =
      await this.testimonialsProvider.getApprovedByOrganization(orgId);
    const testimonialContents = testimonials.map((t) => t.content.value);
    return this.aiSummaryService.summarizeTestimonials(testimonialContents);
  }
}
