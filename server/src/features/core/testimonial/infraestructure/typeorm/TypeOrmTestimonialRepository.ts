import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Like, FindOptionsWhere } from 'typeorm';
import { QueryDeepPartialEntity } from 'typeorm/query-builder/QueryPartialEntity';
import { Testimonial } from '../../domain/Testimonial';
import { TestimonialEntity } from './Testimonial.entity';
import { TestimonialId } from '../../domain/value-objects/TestimonialId';
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
import { TestimonialIdempotencyKey } from '../../domain/value-objects/TestimonialIdempotencyKey';
import { TestimonialCreatedAt } from '../../domain/value-objects/TestimonialCreatedAt';
import { TestimonialUpdatedAt } from '../../domain/value-objects/TestimonialUpdatedAt';
import { TestimonialIsEdited } from '../../domain/value-objects/TestimonialIsEdited';
import { TestimonialRepository } from '../../domain/ports/TestimonialRepository';

@Injectable()
export class TypeOrmTestimonialRepository implements TestimonialRepository {
  constructor(
    @InjectRepository(TestimonialEntity)
    private readonly repository: Repository<TestimonialEntity>,
  ) {}

  async create(testimonial: Testimonial): Promise<void> {
    const primitives = testimonial.toPrimitives();
    const entity = this.repository.create({
      id: primitives.id,
      iKey: primitives.iKey,
      content: primitives.content,
      author: primitives.author,
      status: primitives.status,
      tags: primitives.tags,
      rating: primitives.rating,
      category: primitives.category,
      isEdited: primitives.isEdited,
      imageUrl: primitives.imageUrl,
      videoUrl: primitives.videoUrl,
      createdAt: primitives.createdAt,
      updatedAt: primitives.updatedAt,
    });
    await this.repository.save(entity);
  }

  async findAll(search?: string): Promise<Testimonial[]> {
    const where: FindOptionsWhere<TestimonialEntity> = {};
    if (search) {
      where.content = Like(`%${search}%`);
    }
    const entities = await this.repository.find({ where });
    return entities.map((entity) => this.toDomain(entity));
  }

  async findById(id: TestimonialId): Promise<Testimonial | null> {
    const entity = await this.repository.findOneBy({ id: id.value });
    return entity ? this.toDomain(entity) : null;
  }

  async findApproved(limit?: number): Promise<Testimonial[]> {
    const entities = await this.repository.find({
      where: { status: TestimonialStatusEnum.APPROVED },
      take: limit,
      order: { createdAt: 'DESC' },
    });
    return entities.map((entity) => this.toDomain(entity));
  }

  async approve(id: TestimonialId): Promise<void> {
    await this.repository.update(id.value, {
      status: TestimonialStatusEnum.APPROVED,
    });
  }

  async update(id: TestimonialId, data: Partial<Testimonial>): Promise<void> {
    const updateData: QueryDeepPartialEntity<TestimonialEntity> = {};

    if (data.content) updateData.content = data.content.value;
    if (data.author) updateData.author = data.author.value;
    if (data.status) updateData.status = data.status.value;
    if (data.tags) updateData.tags = data.tags.map((t) => t.value);
    if (data.rating) updateData.rating = data.rating.value;
    if (data.category) updateData.category = data.category.value;
    if (data.isEdited) updateData.isEdited = data.isEdited.value;
    if (data.imageUrl) updateData.imageUrl = data.imageUrl.value;
    if (data.videoUrl) updateData.videoUrl = data.videoUrl.value;
    if (data.updatedAt) updateData.updatedAt = data.updatedAt.value;

    await this.repository.update(id.value, updateData);
  }

  async remove(id: TestimonialId): Promise<void> {
    await this.repository.delete(id.value);
  }

  private toDomain(entity: TestimonialEntity): Testimonial {
    return new Testimonial(
      new TestimonialId(entity.id),
      new TestimonialIdempotencyKey(entity.iKey),
      new TestimonialContent(entity.content),
      new TestimonialAuthor(entity.author),
      new TestimonialStatus(entity.status as TestimonialStatusEnum),
      entity.tags.map((tag) => new TestimonialTag(tag as TestimonialTagEnum)),
      new TestimonialRating(entity.rating as TestimonialRatingEnum),
      new TestimonialCategory(entity.category as TestimonialCategoryEnum),
      new TestimonialIsEdited(entity.isEdited),
      entity.imageUrl ? new TestimonialImageUrl(entity.imageUrl) : undefined,
      entity.videoUrl ? new TestimonialVideoUrl(entity.videoUrl) : undefined,
      entity.createdAt ? new TestimonialCreatedAt(entity.createdAt) : undefined,
      entity.updatedAt ? new TestimonialUpdatedAt(entity.updatedAt) : undefined,
    );
  }
}
