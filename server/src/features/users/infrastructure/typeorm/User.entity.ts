import { Entity, Column, PrimaryColumn } from 'typeorm';

@Entity('users')
export class UserEntity {
  @PrimaryColumn()
  id: string;

  @Column({ unique: true })
  email: string;

  @Column({ default: 'editor' })
  role: string;

  @Column({ default: 'local' })
  provider: string;

  @Column({ nullable: true })
  password?: string;
}
