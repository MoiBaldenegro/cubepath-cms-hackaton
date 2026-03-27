import { Controller, Post, Body, Get, Query, ParseArrayPipe } from '@nestjs/common';
import { TypeOrmAnalyticsEventRepository } from './TypeOrmAnalyticsEventRepository';
import { TrackAnalyticsEvent } from '../application/TrackAnalyticsEvent';
import { GetAnalyticsStats } from '../application/GetAnalyticsStats';

@Controller('analytics')
export class AnalyticsController {
  constructor(private readonly repo: TypeOrmAnalyticsEventRepository) {}

  @Get('batch-stats')
  async batchStats(
    @Query('organizationId') organizationId: string,
    @Query('testimonialIds', new ParseArrayPipe({ items: String, separator: ',' })) testimonialIds: string[],
    @Query('type') type: 'view' | 'click',
  ) {
    const useCase = new GetAnalyticsStats(this.repo);
    const results: Record<string, number> = {};
    await Promise.all(
      testimonialIds.map(async (testimonialId) => {
        results[testimonialId] = await useCase.run({ organizationId, testimonialId, type });
      })
    );
    return { stats: results };
  }

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
