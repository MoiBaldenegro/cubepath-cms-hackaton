export class TestimonialContent {
  readonly value: string;

  constructor(value: string) {
    this.ensureIsValid(value);
    this.value = value;
  }

  private ensureIsValid(value: string): void {
    const trimmedValue = value ? value.trim() : '';
    if (!trimmedValue) {
      throw new Error('TestimonialContent is required');
    }
    if (trimmedValue.length < 10) {
      throw new Error('TestimonialContent must be at least 10 characters long');
    }
    if (trimmedValue.length > 5000) {
      throw new Error('TestimonialContent cannot exceed 5000 characters');
    }
  }
}
