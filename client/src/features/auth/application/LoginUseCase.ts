import type { AuthRepository } from "../domain/AuthRepository";

export class LoginUseCase {
    private readonly repository: AuthRepository;

    constructor(repository: AuthRepository) {
        this.repository = repository;
    }

    async run(email: string, password: string, provider: 'local' | 'supabase' = 'local') {
        return this.repository.login(email, password, provider);
    }
}
