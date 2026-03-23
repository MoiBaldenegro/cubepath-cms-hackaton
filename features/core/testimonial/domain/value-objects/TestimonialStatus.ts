
export enum TestimonialStatusEnum {
    PENDING = 'PENDING',
    APPROVED = 'APPROVED',
    REJECTED = 'REJECTED'
}

export class TestimonialStatus {
    readonly value: TestimonialStatusEnum;

    constructor(value: TestimonialStatusEnum) {
        this.ensureIsValid(value);
        this.value = value;
    }

    private ensureIsValid(value: TestimonialStatusEnum): void {
        if (!Object.values(TestimonialStatusEnum).includes(value)) {
            throw new Error("Invalid TestimonialStatus");
        }
    }
}
