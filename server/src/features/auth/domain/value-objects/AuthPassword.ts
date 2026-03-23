export class AuthPassword {
  constructor(readonly value: string) {
    this.ensureIsStrongPassword(value);
  }

  private ensureIsStrongPassword(value: string): void {
    if (value.length < 6) {
      throw new Error('Password must be at least 6 characters long');
    }
  }
}
