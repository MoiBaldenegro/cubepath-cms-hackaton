import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule } from '@nestjs/config';
import { TestimonialController } from './testimonial.controller';
import { WidgetController } from '../widget/nest/widget.controller';

import { TestimonialServiceContainer } from '../../../../shared/infrastructure/TestimonialServiceContainer';

import { TypeOrmTestimonialRepository } from '../typeorm/TypeOrmTestimonialRepository';

import { TestimonialEntity } from '../typeorm/Testimonial.entity';

import { TestimonialRepository } from '../../domain/ports/TestimonialRepository';

import { AuthModule } from '../../../../auth/infrastructure/nest/auth.module';
import { MediaRepository } from 'src/features/media/domain/MediaRepository';
import { CloudinaryMediaRepository } from 'src/features/media/infrastructure/CloudinaryMediaRepository';

const TESTIMONIAL_REPOSITORY_PROVIDER = {
  provide: 'TestimonialRepository',
  useClass: TypeOrmTestimonialRepository,
};

const MEDIA_REPOSITORY_PROVIDER = {
  provide: 'MediaRepository',
  useClass: CloudinaryMediaRepository, // Se resolverá useClass
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
    MEDIA_REPOSITORY_PROVIDER,
    {
      provide: TestimonialServiceContainer,
      useFactory: (
        repository: TestimonialRepository,
        mediaRepository: MediaRepository,
      ) => new TestimonialServiceContainer(repository, mediaRepository),
      inject: [
        TESTIMONIAL_REPOSITORY_PROVIDER.provide,
        MEDIA_REPOSITORY_PROVIDER.provide,
      ],
    },
  ],
  exports: [TESTIMONIAL_REPOSITORY_PROVIDER],
})
export class TestimonialModule {}
