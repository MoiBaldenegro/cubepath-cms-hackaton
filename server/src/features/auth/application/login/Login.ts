import { AuthRepository } from '../../domain/AuthRepository';
import { AuthEmail } from '../../domain/value-objects/AuthEmail';
import { AuthPassword } from '../../domain/value-objects/AuthPassword';
import { LoginRequest } from './LoginRequest';
import { LoginResponse } from './LoginResponse';
import { UserRepository } from '../../../users/domain/UserRepository';

export class Login {
  constructor(
    private readonly authRepository: AuthRepository,
    private readonly userRepository: UserRepository,
  ) {}

  async run(request: LoginRequest): Promise<LoginResponse> {
    const email = new AuthEmail(request.email);
    const password = new AuthPassword(request.password);

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
      },
      token: primitives.token,
    };
  }
}
