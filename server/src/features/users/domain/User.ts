import { UserId } from './value-objects/UserId';
import { UserEmail } from './value-objects/UserEmail';
import { UserRole } from './value-objects/UserRole';
import { UserPassword } from './value-objects/UserPassword';
import { UserProvider } from './value-objects/UserProvider';

export class User {
  constructor(
    readonly id: UserId,
    readonly email: UserEmail,
    readonly role: UserRole,
    readonly provider: UserProvider,
    readonly password?: UserPassword,
  ) {}

  toPrimitives() {
    return {
      id: this.id.value,
      email: this.email.value,
      role: this.role,
      provider: this.provider.value,
      password: this.password?.value,
    };
  }

  isAdmin(): boolean {
    return this.role === UserRole.ADMIN;
  }
}
