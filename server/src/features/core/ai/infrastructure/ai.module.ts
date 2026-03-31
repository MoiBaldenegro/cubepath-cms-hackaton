import { Module } from '@nestjs/common';
import { TestimonialModule } from '../../testimonial/infraestructure/nest/testimonial.module';
import { AISummaryController } from '../presentation/AISummaryController';
import { SummarizeTestimonialsUseCase } from '../application/SummarizeTestimonialsUseCase';
import { OpenAIAISummaryService } from './OpenAIAISummaryService';
import { OpenRouterAISummaryService } from './OpenRouterAISummaryService';
import { NestTestimonialsProvider } from './NestTestimonialsProvider';

@Module({
  imports: [TestimonialModule],
  controllers: [AISummaryController],
  providers: [
    // Cambia aquí entre OpenAIAISummaryService y OpenRouterAISummaryService según lo que quieras usar
    {
      provide: 'AISummaryService',
      useClass: OpenRouterAISummaryService,
    },
    {
      provide: 'TestimonialsProvider',
      useClass: NestTestimonialsProvider,
    },
    {
      provide: SummarizeTestimonialsUseCase,
      useFactory: (
        aiSummaryService: OpenRouterAISummaryService,
        testimonialsProvider: NestTestimonialsProvider,
      ) =>
        new SummarizeTestimonialsUseCase(
          aiSummaryService,
          testimonialsProvider,
        ),
      inject: ['AISummaryService', 'TestimonialsProvider'],
    },
    NestTestimonialsProvider,
  ],
})
export class AIModule {}
