import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AnalyticsEventEntity } from './AnalyticsEvent.entity';
import { AnalyticsController } from './analytics.controller';
import { TypeOrmAnalyticsEventRepository } from './TypeOrmAnalyticsEventRepository';

@Module({
  imports: [TypeOrmModule.forFeature([AnalyticsEventEntity])],
  controllers: [AnalyticsController],
  providers: [TypeOrmAnalyticsEventRepository],
  exports: [TypeOrmAnalyticsEventRepository],
})
export class AnalyticsModule {}
