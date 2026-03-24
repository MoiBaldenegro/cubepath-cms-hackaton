import type { AuthRepository } from '../domain/AuthRepository';

export class RegisterUseCase {
    private readonly repository: AuthRepository;

    constructor(repository: AuthRepository) {
        this.repository = repository;
    }

    async run(email: string, password: string, provider: 'local' | 'supabase' = 'local') {
        return this.repository.register(email, password, provider);
    }
}
