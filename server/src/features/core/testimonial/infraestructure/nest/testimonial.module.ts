import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TestimonialController } from './testimonial.controller';
import { WidgetController } from '../widget/nest/widget.controller';

import { TestimonialCreate } from '../../application/createTestimonial/createTestimonial';
import { FindAllTestimonials } from '../../application/findAllTestimonials/FindAllTestimonials';
import { ApproveTestimonial } from '../../application/approveTestimonial/ApproveTestimonial';
import { FindTestimonialById } from '../../application/findTestimonialById/FindTestimonialById';
import { FindApprovedTestimonials } from '../../application/findApprovedTestimonials/FindApprovedTestimonials';
import { UpdateTestimonial } from '../../application/updateTestimonial/UpdateTestimonial';
import { RemoveTestimonial } from '../../application/removeTestimonial/RemoveTestimonial';

import { TypeOrmTestimonialRepository } from '../typeorm/TypeOrmTestimonialRepository';

import { TestimonialEntity } from '../typeorm/Testimonial.entity';

import { TestimonialRepository } from '../../domain/ports/TestimonialRepository';

import { AuthModule } from '../../../../auth/infrastructure/nest/auth.module';

const TESTIMONIAL_REPOSITORY_PROVIDER = {
  provide: 'TestimonialRepository',
  useClass: TypeOrmTestimonialRepository,
};

@Module({
  imports: [
    TypeOrmModule.forFeature([TestimonialEntity]),
    AuthModule,
    ConfigModule,
  ],
  controllers: [TestimonialController, WidgetController],
  providers: [
    TESTIMONIAL_REPOSITORY_PROVIDER,
    {
      provide: TestimonialCreate,
      useFactory: (repository: TestimonialRepository) =>
        new TestimonialCreate(repository),
      inject: [TESTIMONIAL_REPOSITORY_PROVIDER.provide],
    },
    {
      provide: FindAllTestimonials,
      useFactory: (repository: TestimonialRepository) =>
        new FindAllTestimonials(repository),
      inject: [TESTIMONIAL_REPOSITORY_PROVIDER.provide],
    },
    {
      provide: ApproveTestimonial,
      useFactory: (repository: TestimonialRepository) =>
        new ApproveTestimonial(repository),
      inject: [TESTIMONIAL_REPOSITORY_PROVIDER.provide],
    },
    {
      provide: FindTestimonialById,
      useFactory: (repository: TestimonialRepository) =>
        new FindTestimonialById(repository),
      inject: [TESTIMONIAL_REPOSITORY_PROVIDER.provide],
    },
    {
      provide: FindApprovedTestimonials,
      useFactory: (repository: TestimonialRepository) =>
        new FindApprovedTestimonials(repository),
      inject: [TESTIMONIAL_REPOSITORY_PROVIDER.provide],
    },
    {
      provide: UpdateTestimonial,
      useFactory: (repository: TestimonialRepository) =>
        new UpdateTestimonial(repository),
      inject: [TESTIMONIAL_REPOSITORY_PROVIDER.provide],
    },
    {
      provide: RemoveTestimonial,
      useFactory: (repository: TestimonialRepository) =>
        new RemoveTestimonial(repository),
      inject: [TESTIMONIAL_REPOSITORY_PROVIDER.provide],
    },
  ],
})
export class TestimonialModule {}
