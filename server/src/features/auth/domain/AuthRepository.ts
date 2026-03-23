import { AuthUser } from './AuthUser';
import { AuthEmail } from './value-objects/AuthEmail';
import { AuthPassword } from './value-objects/AuthPassword';

export interface AuthRepository {
  login(email: AuthEmail, password: AuthPassword): Promise<AuthUser>;
  register(email: AuthEmail, password: AuthPassword): Promise<AuthUser>;
}
