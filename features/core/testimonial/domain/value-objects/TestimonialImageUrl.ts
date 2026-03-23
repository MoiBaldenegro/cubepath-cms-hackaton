
export class TestimonialImageUrl {
    readonly value: string;

    constructor(value: string) {
        this.ensureIsValid(value);
        this.value = value;
    }

    private ensureIsValid(value: string): void {
        if (!value) {
             return; 
        }
        
        try {
            const url = new URL(value);
            if (!['http:', 'https:'].includes(url.protocol)) {
                 throw new Error("Invalid Image URL Protocol");
            }
            if (!/\.(jpg|jpeg|png|webp|gif|svg)$/i.test(url.pathname)) {
                 throw new Error("URL does not appear to be an image file");
            }
        } catch (e) {
            throw new Error("Invalid Image URL format");
        }
    }
}
