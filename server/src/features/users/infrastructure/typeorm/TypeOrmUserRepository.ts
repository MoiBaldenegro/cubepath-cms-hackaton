import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UserRepository } from '../../domain/UserRepository';
import { User } from '../../domain/User';
import { UserEntity } from './User.entity';
import { UserId } from '../../domain/value-objects/UserId';
import { UserEmail } from '../../domain/value-objects/UserEmail';
import { UserRole } from '../../domain/value-objects/UserRole';
import {
  AuthProvider,
  UserProvider,
} from '../../domain/value-objects/UserProvider';
import { UserPassword } from '../../domain/value-objects/UserPassword';

@Injectable()
export class TypeOrmUserRepository implements UserRepository {
  constructor(
    @InjectRepository(UserEntity)
    private readonly repository: Repository<UserEntity>,
  ) {}

  async save(user: User): Promise<void> {
    const primitives = user.toPrimitives();
    // Using save directly will insert or update.
    await this.repository.save({
      id: primitives.id,
      email: primitives.email,
      role: primitives.role,
      provider: primitives.provider,
      password: primitives.password,
    });
  }

  async findById(id: string): Promise<User | null> {
    const entity = await this.repository.findOne({ where: { id } });
    if (!entity) return null;
    return this.toDomain(entity);
  }

  async findByEmail(email: string): Promise<User | null> {
    const entity = await this.repository.findOne({ where: { email } });
    if (!entity) return null;
    return this.toDomain(entity);
  }

  private toDomain(entity: UserEntity): User {
    return new User(
      new UserId(entity.id),
      new UserEmail(entity.email),
      entity.role as UserRole,
      new UserProvider(entity.provider as AuthProvider),
      entity.password ? new UserPassword(entity.password) : undefined,
    );
  }
}
