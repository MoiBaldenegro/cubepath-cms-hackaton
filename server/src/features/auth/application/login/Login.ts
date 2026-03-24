import { AuthRepository } from '../../domain/AuthRepository';
import { AuthEmail } from '../../domain/value-objects/AuthEmail';
import { AuthPassword } from '../../domain/value-objects/AuthPassword';
import { LoginRequest } from './LoginRequest';
import { LoginResponse } from './LoginResponse';
import { UserRepository } from '../../../users/domain/UserRepository';
import { LocalAuthService } from '../../infrastructure/local/LocalAuthService';

export class Login {
  constructor(
    private readonly authRepository: AuthRepository,
    private readonly userRepository: UserRepository,
    private readonly localAuthService: LocalAuthService,
  ) {}

  async run(request: LoginRequest): Promise<LoginResponse> {
    const email = new AuthEmail(request.email);
    const password = new AuthPassword(request.password);

    if (request.provider === 'local') {
      const user = await this.userRepository.findByEmail(email.value);
      if (!user) {
        throw new Error('Invalid credentials');
      }

      const isValid =
        user.password &&
        (await this.localAuthService.comparePassword(
          password.value,
          user.password.value,
        ));
      if (!isValid) {
        throw new Error('Invalid credentials');
      }

      const token = this.localAuthService.generateToken({
        sub: user.id.value,
        email: user.email.value,
        role: user.role,
        organizationId: user.organizationId.value,
      });

      return {
        user: {
          id: user.id.value,
          email: user.email.value,
          role: user.role,
          organizationId: user.organizationId.value,
        },
        token,
      };
    }

    const authUser = await this.authRepository.login(email, password);
    const primitives = authUser.toPrimitives();

    if (!primitives.token) {
      throw new Error('Token not generated');
    }

    const user = await this.userRepository.findById(primitives.id);
    const role = user ? user.role : 'editor'; // Default role if not found, though should exist

    return {
      user: {
        id: primitives.id,
        email: primitives.email,
        role: role,
        organizationId: user?.organizationId?.value ?? '',
      },
      token: primitives.token,
    };
  }
}
