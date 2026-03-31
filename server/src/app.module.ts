import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TestimonialModule } from './features/core/testimonial/infraestructure/nest/testimonial.module';
import { AuthModule } from './features/auth/infrastructure/nest/auth.module';

import { AnalyticsModule } from './features/core/analytics/infraestructure/analytics.module';
import { AIModule } from './features/core/ai/infrastructure/ai.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => ({
        type: 'postgres',
        url: configService.get<string>('DATABASE_URL'),
        autoLoadEntities: true,
        synchronize: true,
      }),
      inject: [ConfigService],
    }),
    AuthModule,
    TestimonialModule,
    AnalyticsModule,
    AIModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
