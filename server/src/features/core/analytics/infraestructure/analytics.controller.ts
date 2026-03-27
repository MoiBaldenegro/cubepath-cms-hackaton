import { Controller, Post, Body, Get, Query } from '@nestjs/common';
import { TypeOrmAnalyticsEventRepository } from './TypeOrmAnalyticsEventRepository';
import { TrackAnalyticsEvent } from '../application/TrackAnalyticsEvent';
import { GetAnalyticsStats } from '../application/GetAnalyticsStats';

@Controller('analytics')
export class AnalyticsController {
  constructor(private readonly repo: TypeOrmAnalyticsEventRepository) {}

  @Post('track')
  async track(@Body() body: { organizationId: string; testimonialId: string; type: 'view' | 'click'; metadata?: any }) {
    const useCase = new TrackAnalyticsEvent(this.repo);
    await useCase.run(body);
    return { success: true };
  }

  @Get('stats')
  async stats(@Query() query: { organizationId: string; testimonialId?: string; type: 'view' | 'click' }) {
    const useCase = new GetAnalyticsStats(this.repo);
    const count = await useCase.run(query);
    return { count };
  }
}
