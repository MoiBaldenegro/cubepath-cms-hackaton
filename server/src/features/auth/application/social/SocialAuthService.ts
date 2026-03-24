import { Injectable, Inject } from '@nestjs/common';
import type { UserRepository } from '../../../users/domain/UserRepository';
import { LocalAuthService } from '../../infrastructure/local/LocalAuthService';
import { CreateUser } from '../../../users/application/createUser/CreateUser';

@Injectable()
export class SocialAuthService {
  constructor(
    @Inject('UserRepository') private readonly userRepository: UserRepository,
    private readonly localAuthService: LocalAuthService,
    private readonly createUser: CreateUser,
  ) {}

  async run(data: { email: string; id: string; provider: string }) {
    let user = await this.userRepository.findByEmail(data.email);

    if (!user) {
      // Create user locally if not exists
      const organizationId = this.localAuthService.generateId();
      await this.createUser.run(
        data.id,
        data.email,
        'editor',
        data.provider,
        organizationId,
        undefined, // No password for social login
      );
      user = await this.userRepository.findByEmail(data.email);
    }

    if (!user) {
      throw new Error('Failed to create or find user');
    }

    // Generate local JWT token
    const token = this.localAuthService.generateToken({
      sub: user.id.value, // Make sure 'sub' maps to id in JwtStrategy
      username: user.email.value,
      role: user.role,
    });

    return {
      user: {
        id: user.id.value,
        email: user.email.value,
        role: user.role,
      },
      token,
    };
  }
}
