import { CreateModerator } from '../../application/createModerator/CreateModerator';
import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { SupabaseAuthRepository } from '../supabase/SupabaseAuthRepository';
import { Login } from '../../application/login/Login';
import { Register } from '../../application/register/Register';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { AuthRepository } from '../../domain/AuthRepository';
import { UsersModule } from '../../../users/infrastructure/nest/users.module'; // Fixed user repository provider import
import { CreateUser } from '../../../users/application/createUser/CreateUser';
import { JwtModule } from '@nestjs/jwt';
import { LocalAuthService } from '../local/LocalAuthService';
import { USER_REPOSITORY_PROVIDER } from '../../../users/infrastructure/nest/users.module';
import { PassportModule } from '@nestjs/passport';
import { JwtStrategy } from './strategies/jwt.strategy';
import { SocialAuthService } from '../../application/social/SocialAuthService';
import { UserRepository } from '../../../users/domain/UserRepository';

const AUTH_REPOSITORY_PROVIDER = {
  provide: 'AuthRepository',
  useClass: SupabaseAuthRepository,
};

@Module({
  imports: [
    ConfigModule,
    UsersModule,
    PassportModule,
    JwtModule.registerAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({
        secret:
          configService.get<string>('JWT_SECRET') || 'dev_secret_key_12345',
        signOptions: { expiresIn: '1d' },
      }),
      inject: [ConfigService],
    }),
  ],
  controllers: [AuthController],
  providers: [
    AUTH_REPOSITORY_PROVIDER,
    LocalAuthService,
    JwtStrategy,
    {
      provide: SocialAuthService,
      useFactory: (
        userRepo: UserRepository,
        localAuth: LocalAuthService,
        createUser: CreateUser,
      ) => new SocialAuthService(userRepo, localAuth, createUser),
      inject: [USER_REPOSITORY_PROVIDER.provide, LocalAuthService, CreateUser],
    },
    {
      provide: Login,
      useFactory: (
        authRepo: AuthRepository,
        userRepo,
        localAuthService: LocalAuthService,
      ) => new Login(authRepo, userRepo, localAuthService),
      inject: [
        'AuthRepository',
        USER_REPOSITORY_PROVIDER.provide,
        LocalAuthService,
      ],
    },
    {
      provide: Register,
      useFactory: (
        authRepo: AuthRepository,
        createUser: CreateUser,
        localAuthService: LocalAuthService,
      ) => new Register(authRepo, createUser, localAuthService),
      inject: ['AuthRepository', CreateUser, LocalAuthService],
    },
    {
      provide: CreateModerator,
      useFactory: (
        createUser: CreateUser,
        localAuthService: LocalAuthService,
      ) => new CreateModerator(createUser, localAuthService),
      inject: [CreateUser, LocalAuthService],
    },
  ],
  exports: [JwtModule, LocalAuthService, PassportModule],
})
export class AuthModule {}
