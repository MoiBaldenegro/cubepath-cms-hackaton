export class TestimonialCreatedAt {
  readonly value: Date;

  constructor(value: Date | string | number) {
    const date = new Date(value);
    this.ensureIsValid(date);
    this.value = date;
  }

  private ensureIsValid(value: Date): void {
    if (isNaN(value.getTime())) {
      throw new Error('Invalid TestimonialCreatedAt date');
    }
  }
}
