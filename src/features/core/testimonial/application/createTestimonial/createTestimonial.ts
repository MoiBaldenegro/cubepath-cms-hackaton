import { TestimonialRepository } from '../../domain/TestimonialRepository';
import { CreateTestimonialRequest } from './CreateTestimonialRequest';
import { Testimonial } from '../../domain/Testimonial';
import { TestimonialId } from '../../domain/value-objects/TestimonialId';
import { TestimonialIdempotencyKey } from '../../domain/value-objects/TestimonialIdempotencyKey';
import { TestimonialContent } from '../../domain/value-objects/TestimonialContent';
import { TestimonialAuthor } from '../../domain/value-objects/TestimonialAuthor';
import {
  TestimonialStatus,
  TestimonialStatusEnum,
} from '../../domain/value-objects/TestimonialStatus';
import {
  TestimonialTag,
  TestimonialTagEnum,
} from '../../domain/value-objects/TestimonialTag';
import {
  TestimonialRating,
  TestimonialRatingEnum,
} from '../../domain/value-objects/TestimonialRating';
import {
  TestimonialCategory,
  TestimonialCategoryEnum,
} from '../../domain/value-objects/TestimonialCategory';
import { TestimonialImageUrl } from '../../domain/value-objects/TestimonialImageUrl';
import { TestimonialVideoUrl } from '../../domain/value-objects/TestimonialVideoUrl';
import { TestimonialCreatedAt } from '../../domain/value-objects/TestimonialCreatedAt';
import { TestimonialUpdatedAt } from '../../domain/value-objects/TestimonialUpdatedAt';
import { TestimonialIsEdited } from '../../domain/value-objects/TestimonialIsEdited';
import { randomUUID } from 'crypto';

export class TestimonialCreate {
  constructor(private repository: TestimonialRepository) {}

  async run(request: CreateTestimonialRequest): Promise<void> {
    const id = new TestimonialId(randomUUID());
    const iKey = new TestimonialIdempotencyKey(request.iKey);
    const content = new TestimonialContent(request.content);
    const author = new TestimonialAuthor(request.author);
    const status = new TestimonialStatus(TestimonialStatusEnum.PENDING);

    const tags = request.tags.map((tag) => {
      if (
        !Object.values(TestimonialTagEnum).includes(tag as TestimonialTagEnum)
      ) {
        throw new Error(`Invalid tag: ${tag}`);
      }
      return new TestimonialTag(tag as TestimonialTagEnum);
    });

    if (
      !Object.values(TestimonialRatingEnum).includes(
        request.rating as TestimonialRatingEnum,
      )
    ) {
      throw new Error(`Invalid rating: ${request.rating}`);
    }
    const rating = new TestimonialRating(
      request.rating as TestimonialRatingEnum,
    );

    if (
      !Object.values(TestimonialCategoryEnum).includes(
        request.category as TestimonialCategoryEnum,
      )
    ) {
      throw new Error(`Invalid category: ${request.category}`);
    }
    const category = new TestimonialCategory(
      request.category as TestimonialCategoryEnum,
    );

    const isEdited = new TestimonialIsEdited(false);
    const createdAt = new TestimonialCreatedAt(new Date());
    const updatedAt = new TestimonialUpdatedAt(new Date());

    const imageUrl = request.imageUrl
      ? new TestimonialImageUrl(request.imageUrl)
      : undefined;
    const videoUrl = request.videoUrl
      ? new TestimonialVideoUrl(request.videoUrl)
      : undefined;

    const testimonial = new Testimonial(
      id,
      iKey,
      content,
      author,
      status,
      tags,
      rating,
      category,
      isEdited,
      imageUrl,
      videoUrl,
      createdAt,
      updatedAt,
    );

    await this.repository.create(testimonial);
  }
}
