import { TestimonialRepository } from "../../domain/TestimonialRepository";
import { UpdateTestimonialRequest } from "./UpdateTestimonialRequest";
import { TestimonialId } from "../../domain/value-objects/TestimonialId";
import { TestimonialContent } from "../../domain/value-objects/TestimonialContent";
import { TestimonialAuthor } from "../../domain/value-objects/TestimonialAuthor";
import { TestimonialStatus, TestimonialStatusEnum } from "../../domain/value-objects/TestimonialStatus";
import { TestimonialTag, TestimonialTagEnum } from "../../domain/value-objects/TestimonialTag";
import { TestimonialRating, TestimonialRatingEnum } from "../../domain/value-objects/TestimonialRating";
import { TestimonialCategory, TestimonialCategoryEnum } from "../../domain/value-objects/TestimonialCategory";
import { TestimonialImageUrl } from "../../domain/value-objects/TestimonialImageUrl";
import { TestimonialVideoUrl } from "../../domain/value-objects/TestimonialVideoUrl";
import { TestimonialUpdatedAt } from "../../domain/value-objects/TestimonialUpdatedAt";
import { TestimonialIsEdited } from "../../domain/value-objects/TestimonialIsEdited";
import { TestimonialNotFoundError } from "../../domain/errors/TestimonialNotFoundError";

export class UpdateTestimonial {
    constructor(private repository: TestimonialRepository) { }

    async run(request: UpdateTestimonialRequest): Promise<void> {
        const id = new TestimonialId(request.id);
        
        const existingTestimonial = await this.repository.findById(id);
        if (!existingTestimonial) {
             throw new TestimonialNotFoundError(request.id);
        }

        const data: any = {
            updatedAt: new TestimonialUpdatedAt(new Date()),
            isEdited: new TestimonialIsEdited(true)
        };

        if (request.content) {
            data.content = new TestimonialContent(request.content);
        }
        if (request.author) {
            data.author = new TestimonialAuthor(request.author);
        }
        if (request.status) {
            if (!Object.values(TestimonialStatusEnum).includes(request.status as TestimonialStatusEnum)) {
                 throw new Error(`Invalid status: ${request.status}`);
            }
            data.status = new TestimonialStatus(request.status as TestimonialStatusEnum);
        }
        if (request.tags) {
            data.tags = request.tags.map(tag => {
                if (!Object.values(TestimonialTagEnum).includes(tag as TestimonialTagEnum)) {
                    throw new Error(`Invalid tag: ${tag}`);
                }
                return new TestimonialTag(tag as TestimonialTagEnum);
            });
        }
        if (request.rating) {
            if (!Object.values(TestimonialRatingEnum).includes(request.rating as TestimonialRatingEnum)) {
                throw new Error(`Invalid rating: ${request.rating}`);
            }
            data.rating = new TestimonialRating(request.rating as TestimonialRatingEnum);
        }
        if (request.category) {
            if (!Object.values(TestimonialCategoryEnum).includes(request.category as TestimonialCategoryEnum)) {
                throw new Error(`Invalid category: ${request.category}`);
            }
            data.category = new TestimonialCategory(request.category as TestimonialCategoryEnum);
        }
        if (request.imageUrl) {
             data.imageUrl = new TestimonialImageUrl(request.imageUrl);
        }
        if (request.videoUrl) {
             data.videoUrl = new TestimonialVideoUrl(request.videoUrl);
        }

        await this.repository.update(id, data);
    }
}
