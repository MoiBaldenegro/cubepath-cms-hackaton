export class UserPassword {
  constructor(readonly value: string) {
    // Password validation could be stronger here if needed
    // But since it might be a hash, better to just check non-empty if provided
    // It's optional, so we handle that in the User class or factory
  }
}
