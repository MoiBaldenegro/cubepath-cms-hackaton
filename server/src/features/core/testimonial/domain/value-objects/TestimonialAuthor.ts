export class TestimonialAuthor {
  readonly value: string;

  constructor(value: string) {
    this.ensureIsValid(value);
    this.value = value;
  }

  private ensureIsValid(value: string): void {
    const trimmedValue = value ? value.trim() : '';
    if (!trimmedValue) {
      throw new Error('TestimonialAuthor is required');
    }
    if (trimmedValue.length < 2) {
      throw new Error(
        'TestimonialAuthor name is too short. It must be at least 2 characters.',
      );
    }
    if (trimmedValue.length > 100) {
      throw new Error(
        'TestimonialAuthor name is too long. It must be under 100 characters.',
      );
    }

    if (/^[^a-zA-Z0-9\s]+$/.test(trimmedValue)) {
      throw new Error('TestimonialAuthor name contains invalid characters');
    }
  }
}
