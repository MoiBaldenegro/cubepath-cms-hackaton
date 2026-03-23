
export enum TestimonialTagEnum {
    PRODUCT = 'PRODUCT',
    SERVICE = 'SERVICE',
    SUPPORT = 'SUPPORT',
}

export class TestimonialTag {
    readonly value: TestimonialTagEnum;

    constructor(value: TestimonialTagEnum) {
        this.ensureIsValid(value);
        this.value = value;
    }

    private ensureIsValid(value: TestimonialTagEnum): void {
        if (!Object.values(TestimonialTagEnum).includes(value)) {
            throw new Error("Invalid TestimonialTag");
        }
    }
}
