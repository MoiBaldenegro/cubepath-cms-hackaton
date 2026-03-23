import { TestimonialId } from './value-objects/TestimonialId';
import { TestimonialIdempotencyKey } from './value-objects/TestimonialIdempotencyKey';
import { TestimonialContent } from './value-objects/TestimonialContent';
import { TestimonialAuthor } from './value-objects/TestimonialAuthor';
import { TestimonialStatus } from './value-objects/TestimonialStatus';
import { TestimonialTag } from './value-objects/TestimonialTag';
import { TestimonialRating } from './value-objects/TestimonialRating';
import { TestimonialCategory } from './value-objects/TestimonialCategory';
import { TestimonialImageUrl } from './value-objects/TestimonialImageUrl';
import { TestimonialVideoUrl } from './value-objects/TestimonialVideoUrl';
import { TestimonialCreatedAt } from './value-objects/TestimonialCreatedAt';
import { TestimonialUpdatedAt } from './value-objects/TestimonialUpdatedAt';
import { TestimonialIsEdited } from './value-objects/TestimonialIsEdited';

export class Testimonial {
    id: TestimonialId;
    iKey: TestimonialIdempotencyKey;
    content: TestimonialContent;
    author: TestimonialAuthor;
    status: TestimonialStatus;
    tags: TestimonialTag[];
    rating: TestimonialRating;
    category: TestimonialCategory;
    isEdited: TestimonialIsEdited;
    imageUrl?: TestimonialImageUrl;
    videoUrl?: TestimonialVideoUrl;
    createdAt?: TestimonialCreatedAt;
    updatedAt?: TestimonialUpdatedAt;

    constructor(
        id: TestimonialId,
        iKey: TestimonialIdempotencyKey,
        content: TestimonialContent,
        author: TestimonialAuthor,
        status: TestimonialStatus,
        tags: TestimonialTag[],
        rating: TestimonialRating,
        category: TestimonialCategory,
        isEdited: TestimonialIsEdited,
        imageUrl?: TestimonialImageUrl,
        videoUrl?: TestimonialVideoUrl,
        createdAt?: TestimonialCreatedAt,
        updatedAt?: TestimonialUpdatedAt
    ) {
        this.id = id;
        this.iKey = iKey;
        this.content = content;
        this.author = author;
        this.status = status;
        this.tags = tags;
        this.rating = rating;
        this.category = category;
        this.isEdited = isEdited;
        this.imageUrl = imageUrl;
        this.videoUrl = videoUrl;
        this.createdAt = createdAt;
        this.updatedAt = updatedAt;
    }

    toPrimitives() {
        return {
            id: this.id.value,
            iKey: this.iKey.value,
            content: this.content.value,
            author: this.author.value,
            status: this.status.value,
            tags: this.tags.map(tag => tag.value),
            rating: this.rating.value,
            category: this.category.value,
            isEdited: this.isEdited.value,
            imageUrl: this.imageUrl?.value,
            videoUrl: this.videoUrl?.value,
            createdAt: this.createdAt?.value,
            updatedAt: this.updatedAt?.value
        };
    }
}

