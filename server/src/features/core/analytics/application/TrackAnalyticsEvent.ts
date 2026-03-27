import { TypeOrmAnalyticsEventRepository } from '../infraestructure/TypeOrmAnalyticsEventRepository';
import { AnalyticsEvent, AnalyticsEventType } from '../domain/AnalyticsEvent';
import { v4 as uuidv4 } from 'uuid';

export class TrackAnalyticsEvent {
  constructor(private repo: TypeOrmAnalyticsEventRepository) {}

  async run(params: {
    organizationId: string;
    testimonialId: string;
    type: AnalyticsEventType;
    metadata?: Record<string, any>;
  }) {
    const event = new AnalyticsEvent({
      id: uuidv4(),
      organizationId: params.organizationId,
      testimonialId: params.testimonialId,
      type: params.type,
      createdAt: new Date(),
      metadata: params.metadata,
    });
    await this.repo.save(event);
  }
}
