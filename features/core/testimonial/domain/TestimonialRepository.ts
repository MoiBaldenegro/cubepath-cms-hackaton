import { Testimonial } from "./Testimonial";
import { TestimonialId } from "./value-objects/TestimonialId";

export interface TestimonialRepository {
    create(testimonial: Testimonial): Promise<void>;
    findAll(search?: string): Promise<Testimonial[]>;
    aprove(id: TestimonialId): Promise<void>;
    findApproved(limit?: number): Promise<Testimonial[]>;
    update(id: TestimonialId, data: Partial<Testimonial>): Promise<void>;
    remove(id: TestimonialId): Promise<void>;
    findById(id: TestimonialId): Promise<Testimonial | null>;
}


