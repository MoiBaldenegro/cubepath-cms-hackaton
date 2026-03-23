import { TestimonialRepository } from "../../domain/TestimonialRepository";
import { FindApprovedTestimoniaRequest } from "./FindApprovedTestimoniaRequest";
import { FindApprovedTestimonialsResponse } from "./FindApprovedTestimonialsResponse";

export class FindApprovedTestimonials {
    constructor(private repository: TestimonialRepository) { }

    async run(request: FindApprovedTestimoniaRequest = {}): Promise<FindApprovedTestimonialsResponse[]> {
        const testimonials = await this.repository.findApproved(request.limit);

        return testimonials.map(testimonial => testimonial.toPrimitives());
    }
}
