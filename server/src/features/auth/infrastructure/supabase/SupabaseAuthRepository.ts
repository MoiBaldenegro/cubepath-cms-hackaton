import { Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { createClient, SupabaseClient } from '@supabase/supabase-js';
import { AuthRepository } from '../../domain/AuthRepository';
import { AuthUser } from '../../domain/AuthUser';
import { AuthEmail } from '../../domain/value-objects/AuthEmail';
import { AuthPassword } from '../../domain/value-objects/AuthPassword';
import { AuthToken } from '../../domain/value-objects/AuthToken';

@Injectable()
export class SupabaseAuthRepository implements AuthRepository {
  private supabase: SupabaseClient;

  constructor(private configService: ConfigService) {
    this.supabase = createClient(
      this.configService.get<string>('SUPABASE_URL') || '',
      this.configService.get<string>('SUPABASE_KEY') || '',
    );
  }

  async login(email: AuthEmail, password: AuthPassword): Promise<AuthUser> {
    const { data, error } = await this.supabase.auth.signInWithPassword({
      email: email.value,
      password: password.value,
    });

    if (error) {
      throw new UnauthorizedException(error.message);
    }

    if (!data.user || !data.session) {
      throw new UnauthorizedException('Invalid credentials');
    }

    return new AuthUser(
      data.user.id,
      new AuthEmail(data.user.email!),
      new AuthToken(data.session.access_token),
    );
  }

  async register(email: AuthEmail, password: AuthPassword): Promise<AuthUser> {
    const { data, error } = await this.supabase.auth.signUp({
      email: email.value,
      password: password.value,
    });

    if (error) {
      throw new UnauthorizedException(error.message);
    }

    if (!data.user) {
      throw new UnauthorizedException('Could not create user');
    }

    // Note: session might be null if email confirmation is enabled
    const token = data.session
      ? new AuthToken(data.session.access_token)
      : undefined;

    return new AuthUser(data.user.id, new AuthEmail(data.user.email!), token);
  }
}
