import { User } from './User';

import { OrganizationId } from '../../core/testimonial/domain/value-objects/OrganizationId';

export interface UserRepository {
  save(user: User): Promise<void>;
  findById(id: string): Promise<User | null>;
  findByEmail(email: string): Promise<User | null>;
  findAll(organizationId?: OrganizationId): Promise<User[]>;
}
