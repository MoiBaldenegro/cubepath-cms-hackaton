
export class TestimonialIdempotencyKey {
    readonly value: string;

    constructor(value: string) {
        this.ensureIsValid(value);
        this.value = value;
    }

    private ensureIsValid(value: string): void {
        if (!value || value.trim().length === 0) {
            throw new Error("TestimonialIdempotencyKey is required");
        }
        // UUID v4 regex or similar robust check if strictly UUID, 
        // strictly checking for length effectively for now.
        if (value.length < 10) { 
             throw new Error("TestimonialIdempotencyKey seems too short to be valid");
        }
        if (value.length > 100) {
             throw new Error("TestimonialIdempotencyKey is too long");
        }
    }
}
