export class WidgetName {
  constructor(readonly value: string) {
    this.ensureIsValid(value);
  }

  private ensureIsValid(value: string): void {
    if (!value || value.length < 3) {
      throw new Error('WidgetName must be at least 3 characters long');
    }
  }
}
