import { UserRepository } from '../../domain/UserRepository';
import { User } from '../../domain/User';
import { UserEmail } from '../../domain/value-objects/UserEmail';
import { UserId } from '../../domain/value-objects/UserId';
import { UserRole } from '../../domain/value-objects/UserRole';
import {
  AuthProvider,
  UserProvider,
} from '../../domain/value-objects/UserProvider';
import { UserPassword } from '../../domain/value-objects/UserPassword';
import { OrganizationId } from '../../../core/testimonial/domain/value-objects/OrganizationId';

export class CreateUser {
  constructor(private readonly repository: UserRepository) {}

  async run(
    id: string,
    email: string,
    role: string = 'editor',
    provider: string = 'local',
    organizationId: string,
    password?: string,
  ): Promise<void> {
    const user = new User(
      new UserId(id),
      new UserEmail(email),
      role as UserRole,
      new UserProvider(provider as AuthProvider),
      new OrganizationId(organizationId),
      password ? new UserPassword(password) : undefined,
    );
    await this.repository.save(user);
  }
}
