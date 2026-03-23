export class TestimonialId {
  readonly value: string;

  constructor(value: string) {
    this.ensureIsValid(value);
    this.value = value;
  }

  private ensureIsValid(value: string): void {
    if (!value) {
      throw new Error('TestimonialId is required');
    }
    // UUID validation regex
    if (
      !/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(
        value,
      )
    ) {
      throw new Error('Invalid TestimonialId format (must be a valid UUID)');
    }
  }
}
