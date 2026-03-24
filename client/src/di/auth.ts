import { LoginUseCase } from '../features/auth/application/LoginUseCase';
import { RegisterUseCase } from '../features/auth/application/RegisterUseCase';
import { SocialLoginUseCase } from '../features/auth/application/SocialLoginUseCase';
import { FetchAuthRepository } from '../features/auth/infrastructure/FetchAuthRepository';

const authRepository = new FetchAuthRepository();

export const loginUseCase = new LoginUseCase(authRepository);
export const registerUseCase = new RegisterUseCase(authRepository);
export const socialLoginUseCase = new SocialLoginUseCase(authRepository);
