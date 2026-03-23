export class AuthToken {
  constructor(readonly value: string) {
    if (!value) {
      throw new Error('Token cannot be empty');
    }
  }
}
