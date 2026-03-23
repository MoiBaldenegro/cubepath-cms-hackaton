import { AuthEmail } from './value-objects/AuthEmail';
import { AuthToken } from './value-objects/AuthToken';

export class AuthUser {
  constructor(
    readonly id: string,
    readonly email: AuthEmail,
    readonly token?: AuthToken,
  ) {}

  toPrimitives() {
    return {
      id: this.id,
      email: this.email.value,
      token: this.token?.value,
    };
  }
}
