export class WidgetId {
  constructor(readonly value: string) {
    this.ensureIsValid(value);
  }

  private ensureIsValid(value: string): void {
    if (!value) {
      throw new Error('WidgetId cannot be empty');
    }
  }
}
