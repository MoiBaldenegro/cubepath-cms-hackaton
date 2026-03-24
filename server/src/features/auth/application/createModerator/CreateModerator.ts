import { CreateUser } from '../../../users/application/createUser/CreateUser';
import { LocalAuthService } from '../../infrastructure/local/LocalAuthService';

export interface CreateModeratorRequest {
  email: string;
  password?: string;
  organizationId: string;
}

export class CreateModerator {
  constructor(
    private readonly createUser: CreateUser,
    private readonly localAuthService: LocalAuthService,
  ) {}

  async run(request: CreateModeratorRequest): Promise<{ id: string }> {
    const id = this.localAuthService.generateId();
    let hashedPassword: string | undefined = undefined;
    
    // For now we assume local auth for simplicity
    if (request.password) {
        hashedPassword = await this.localAuthService.hashPassword(request.password);
    }
    
    // Role is always 'editor' (Moderator)
    await this.createUser.run(
      id,
      request.email,
      'editor',
      'local',
      request.organizationId,
      hashedPassword,
    );

    return { id };
  }
}
