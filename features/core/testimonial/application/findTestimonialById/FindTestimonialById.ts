import { TestimonialRepository } from "../../domain/TestimonialRepository";
import { FindTestimonialByIdRequest } from "./FindTestimonialByIdRequest";
import { FindTestimonialByIdResponse } from "./FindTestimonialByIdResponse";
import { TestimonialId } from "../../domain/value-objects/TestimonialId";
import { TestimonialNotFoundError } from "../../domain/errors/TestimonialNotFoundError";

export class FindTestimonialById {
    constructor(private repository: TestimonialRepository) { }

    async run(request: FindTestimonialByIdRequest): Promise<FindTestimonialByIdResponse> {
        const id = new TestimonialId(request.id);
        const testimonial = await this.repository.findById(id);

        if (!testimonial) {
            throw new TestimonialNotFoundError(request.id);
        }

        return testimonial.toPrimitives();
    }
}
