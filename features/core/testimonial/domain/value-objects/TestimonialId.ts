
export class TestimonialId {
    readonly value: string;

    constructor(value: string) {
        this.ensureIsValid(value);
        this.value = value;
    }

    private ensureIsValid(value: string): void {
        if (!value) {
            throw new Error("TestimonialId is required");
        }
        // MongoDB ObjectId validation regex (24 hex characters)
        if (!/^[0-9a-fA-F]{24}$/.test(value)) {
            throw new Error("Invalid TestimonialId format (must be a 24-character hex string)");
        }
    }
}
