import { UserRepository } from '../../domain/UserRepository';
import { User } from '../../domain/User';

import { OrganizationId } from '../../../core/testimonial/domain/value-objects/OrganizationId';

export class FindAllUsers {
  constructor(private readonly repository: UserRepository) {}

  async run(organizationId?: string): Promise<User[]> {
    return this.repository.findAll(organizationId ? new OrganizationId(organizationId) : undefined);
  }
}
