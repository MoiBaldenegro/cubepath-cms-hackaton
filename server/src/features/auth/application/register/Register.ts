import { AuthRepository } from '../../domain/AuthRepository';
import { AuthEmail } from '../../domain/value-objects/AuthEmail';
import { AuthPassword } from '../../domain/value-objects/AuthPassword';
import { RegisterRequest } from './RegisterRequest';
import { RegisterResponse } from './RegisterResponse';
import { CreateUser } from '../../../users/application/createUser/CreateUser';

export class Register {
  constructor(
    private readonly authRepository: AuthRepository,
    private readonly createUser: CreateUser,
  ) {}

  async run(request: RegisterRequest): Promise<RegisterResponse> {
    const email = new AuthEmail(request.email);
    const password = new AuthPassword(request.password);

    const authUser = await this.authRepository.register(email, password);
    const primitives = authUser.toPrimitives();

    // Create user in local DB with default role 'editor' or as specified
    // We are registering via Supabase, so provider is 'supabase'.
    // Supabase handles the password, so we don't store it locally (or we could, but better not duplicate secrets unless syncing)
    await this.createUser.run(
      primitives.id,
      primitives.email,
      'editor',
      'supabase',
    );

    return {
      user: {
        id: primitives.id,
        email: primitives.email,
      },
    };
  }
}
