import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { SupabaseAuthRepository } from '../supabase/SupabaseAuthRepository';
import { Login } from '../../application/login/Login';
import { Register } from '../../application/register/Register';
import { ConfigModule } from '@nestjs/config';
import { AuthRepository } from '../../domain/AuthRepository';
import {
  UsersModule,
  USER_REPOSITORY_PROVIDER,
} from '../../../users/infrastructure/nest/users.module';
import { CreateUser } from '../../../users/application/createUser/CreateUser';

const AUTH_REPOSITORY_PROVIDER = {
  provide: 'AuthRepository',
  useClass: SupabaseAuthRepository,
};

@Module({
  imports: [ConfigModule, UsersModule],
  controllers: [AuthController],
  providers: [
    AUTH_REPOSITORY_PROVIDER,
    {
      provide: Login,
      useFactory: (authRepo: AuthRepository, userRepo) =>
        new Login(authRepo, userRepo),
      inject: ['AuthRepository', USER_REPOSITORY_PROVIDER.provide],
    },
    {
      provide: Register,
      useFactory: (authRepo: AuthRepository, createUser) =>
        new Register(authRepo, createUser),
      inject: ['AuthRepository', CreateUser],
    },
  ],
})
export class AuthModule {}
