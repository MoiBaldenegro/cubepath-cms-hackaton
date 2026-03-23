export class TestimonialVideoUrl {
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
        throw new Error('Invalid Video URL Protocol');
      }
    } catch (e) {
      throw new Error('Invalid Video URL format');
    }
  }
}
