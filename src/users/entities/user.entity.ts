import { Exclude } from 'class-transformer/decorators';
import {
  BaseEntity,
  Column,
  Entity,
  PrimaryGeneratedColumn,
  Unique,
  getRepository,
} from 'typeorm';
import * as bcrypt from 'bcrypt';

@Entity()
@Unique(['email', 'username'])
export class User extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  email: string;

  @Column({ select: false })
  @Exclude()
  password: string;

  @Column({ select: false })
  @Exclude()
  salt: string;

  @Column()
  username: string;

  async validatePassword(password: string): Promise<boolean> {
    const query = await getRepository(User)
      .createQueryBuilder('user')
      .addSelect('user.password')
      .addSelect('user.salt')
      .getRawOne();

    const salt = query['user_salt'];
    const userPassword = query['user_password'];
    const hash = await bcrypt.hash(password, salt);
    return hash === userPassword;
  }
}
