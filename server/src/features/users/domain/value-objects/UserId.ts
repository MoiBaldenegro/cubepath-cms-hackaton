export class UserId {
  constructor(readonly value: string) {
    if (!value) {
      throw new Error('UserId cannot be empty');
    }
  }
}
