import type { AuthRepository } from '../domain/AuthRepository';

export class SocialLoginUseCase {
    private readonly repository: AuthRepository;

    constructor(repository: AuthRepository) {
        this.repository = repository;
    }

    async run(email: string, id: string, provider: string) {
        return this.repository.socialLogin(email, id, provider);
    }
}