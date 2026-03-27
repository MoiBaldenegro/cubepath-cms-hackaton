import { TypeOrmAnalyticsEventRepository } from '../infraestructure/TypeOrmAnalyticsEventRepository';
import { AnalyticsEventType } from '../domain/AnalyticsEvent';

export class GetAnalyticsStats {
  constructor(private repo: TypeOrmAnalyticsEventRepository) {}

  async run(params: {
    organizationId: string;
    testimonialId?: string;
    type: AnalyticsEventType;
  }): Promise<number> {
    if (params.testimonialId) {
      return this.repo.countByTestimonial(params.organizationId, params.testimonialId, params.type);
    }
    return this.repo.countByOrganization(params.organizationId, params.type);
  }
}
