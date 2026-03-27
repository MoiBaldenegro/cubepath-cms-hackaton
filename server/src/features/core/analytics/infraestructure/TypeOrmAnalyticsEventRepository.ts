import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { AnalyticsEventEntity } from './AnalyticsEvent.entity';
import { AnalyticsEvent, AnalyticsEventType } from '../domain/AnalyticsEvent';

@Injectable()
export class TypeOrmAnalyticsEventRepository {
  constructor(
    @InjectRepository(AnalyticsEventEntity)
    private readonly repository: Repository<AnalyticsEventEntity>,
  ) {}

  async save(event: AnalyticsEvent): Promise<void> {
    const entity = this.repository.create({
      organizationId: event.organizationId,
      testimonialId: event.testimonialId,
      type: event.type,
      createdAt: event.createdAt,
      metadata: event.metadata,
    });
    await this.repository.save(entity);
  }

  async countByTestimonial(organizationId: string, testimonialId: string, type: AnalyticsEventType): Promise<number> {
    return this.repository.count({
      where: { organizationId, testimonialId, type },
    });
  }

  async countByOrganization(organizationId: string, type: AnalyticsEventType): Promise<number> {
    return this.repository.count({
      where: { organizationId, type },
    });
  }
}
