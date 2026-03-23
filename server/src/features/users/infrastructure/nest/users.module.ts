import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserEntity } from '../typeorm/User.entity';
import { TypeOrmUserRepository } from '../typeorm/TypeOrmUserRepository';
import { CreateUser } from '../../application/createUser/CreateUser';

export const USER_REPOSITORY_PROVIDER = {
  provide: 'UserRepository',
  useClass: TypeOrmUserRepository,
};

@Module({
  imports: [TypeOrmModule.forFeature([UserEntity])],
  controllers: [],
  providers: [
    USER_REPOSITORY_PROVIDER,
    {
      provide: CreateUser,
      useFactory: (repository) => new CreateUser(repository),
      inject: ['UserRepository'],
    },
  ],
  exports: [USER_REPOSITORY_PROVIDER, CreateUser],
})
export class UsersModule {}
