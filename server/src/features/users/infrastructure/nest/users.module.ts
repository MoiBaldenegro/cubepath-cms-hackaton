import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserEntity } from '../typeorm/User.entity';
import { TypeOrmUserRepository } from '../typeorm/TypeOrmUserRepository';
import { UpdateUserRole } from '../../application/updateUserRole/UpdateUserRole';
import { CreateUser } from '../../application/createUser/CreateUser';
import { FindAllUsers } from '../../application/findAllUsers/FindAllUsers';
import { UserController } from './user.controller';

export const USER_REPOSITORY_PROVIDER = {
  provide: 'UserRepository',
  useClass: TypeOrmUserRepository,
};

@Module({
  imports: [TypeOrmModule.forFeature([UserEntity])],
  controllers: [UserController],
  providers: [
    USER_REPOSITORY_PROVIDER,
    {
      provide: CreateUser,
      useFactory: (repository) => new CreateUser(repository),
      inject: ['UserRepository'],
    },
    {
      provide: FindAllUsers,
      useFactory: (repository) => new FindAllUsers(repository),
      inject: ['UserRepository'],
    },
    {
      provide: UpdateUserRole,
      useFactory: (repository) => new UpdateUserRole(repository),
      inject: ['UserRepository'],
    },
  ],
  exports: [USER_REPOSITORY_PROVIDER, CreateUser, FindAllUsers, UpdateUserRole],
})
export class UsersModule {}
