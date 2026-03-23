export class TestimonialIdempotencyKey {
  readonly value: string;

  constructor(value: string) {
    this.ensureIsValid(value);
    this.value = value;
  }

  private ensureIsValid(value: string): void {
    if (!value || value.trim().length === 0) {
      throw new Error('TestimonialIdempotencyKey is required');
    }
    // UUID validation regex (usually idempotency keys are UUIDs too in this context)
    if (
      !/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(
        value,
      )
    ) {
      throw new Error('TestimonialIdempotencyKey must be a valid UUID');
    }
  }
}
