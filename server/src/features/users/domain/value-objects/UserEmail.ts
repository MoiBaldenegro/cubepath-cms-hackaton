export class UserEmail {
  constructor(readonly value: string) {
    this.ensureIsValidEmail(value);
  }

  private ensureIsValidEmail(value: string): void {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(value)) {
      throw new Error(`The email <${value}> is not valid`);
    }
  }
}
