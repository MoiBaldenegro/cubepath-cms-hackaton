import { AuthRepository } from '../../domain/AuthRepository';
import { AuthEmail } from '../../domain/value-objects/AuthEmail';
import { AuthPassword } from '../../domain/value-objects/AuthPassword';
import { RegisterRequest } from './RegisterRequest';
import { RegisterResponse } from './RegisterResponse';
import { CreateUser } from '../../../users/application/createUser/CreateUser';
import { LocalAuthService } from '../../infrastructure/local/LocalAuthService';

export class Register {
  constructor(
    private readonly authRepository: AuthRepository,
    private readonly createUser: CreateUser,
    private readonly localAuthService: LocalAuthService,
  ) {}

  async run(request: RegisterRequest): Promise<RegisterResponse> {
    const email = new AuthEmail(request.email);
    const password = new AuthPassword(request.password);
    const role = 'admin'; // New registrations are Organization Admins (Clients)
    const organizationId = this.localAuthService.generateId(); // Generate new Organization for the client

    if (request.provider === 'local') {
      const hashedPassword = await this.localAuthService.hashPassword(
        password.value,
      );
      const id = this.localAuthService.generateId();

      await this.createUser.run(
        id,
        email.value,
        role,
        'local',
        organizationId,
        hashedPassword,
      );

      // Generate token for auto-login
      const token = this.localAuthService.generateToken({
        sub: id,
        email: email.value,
        role,
        organizationId,
      });

      return {
        user: {
          id,
          email: email.value,
          token,
        },
      } as any;
    }

    const authUser = await this.authRepository.register(email, password);
    const primitives = authUser.toPrimitives();

    await this.createUser.run(
      primitives.id,
      primitives.email,
      role,
      'supabase',
      organizationId,
    );

    return {
      user: {
        id: primitives.id,
        email: primitives.email,
      },
    };
  }
}
