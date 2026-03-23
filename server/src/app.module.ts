import { Module } from '@nestjs/common';
import { TestimonialModule } from './features/core/testimonial/infraestructure/nest/testimonial.module';

@Module({
  imports: [TestimonialModule],
  controllers: [],
  providers: [],
})
export class AppModule {}
