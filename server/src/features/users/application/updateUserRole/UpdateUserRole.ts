import { UserRepository } from '../../domain/UserRepository';
import { UpdateUserRoleRequest } from './UpdateUserRoleRequest';
import { UserRole } from '../../domain/value-objects/UserRole';

export class UpdateUserRole {
  constructor(private readonly userRepository: UserRepository) {}

  async run(request: UpdateUserRoleRequest): Promise<void> {
    const user = await this.userRepository.findById(request.id);
    if (!user) {
      throw new Error(`User with id ${request.id} not found`);
    }

    const newRole = request.role === 'admin' ? UserRole.ADMIN : UserRole.EDITOR;
    const updatedUser = user.updateRole(newRole);

    await this.userRepository.save(updatedUser);
  }
}