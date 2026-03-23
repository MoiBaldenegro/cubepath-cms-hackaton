import { TestimonialRepository } from "../../domain/TestimonialRepository";
import { FindAllTestimonialsRequest } from "./FindAllTestimonialsRequest";
import { FindAllTestimonialsResponse } from "./FindAllTestimonialsResponse";

export class FindAllTestimonials {
    constructor(private repository: TestimonialRepository) { }

    async run(request: FindAllTestimonialsRequest = {}): Promise<FindAllTestimonialsResponse[]> {
        const testimonials = await this.repository.findAll(request.search);

        return testimonials.map(testimonial => testimonial.toPrimitives());
    }
}
