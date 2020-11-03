import { Exclude } from 'class-transformer/decorators';
import {
  BaseEntity,
  Column,
  Entity,
  PrimaryGeneratedColumn,
  Unique,
  getRepository,
} from 'typeorm';
import * as argon2 from 'argon2';

@Entity()
@Unique(['email', 'username'])
export class User extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  email: string;

  @Column({ select: false, nullable: true })
  @Exclude()
  password: string;

  @Column({ nullable: true })
  username: string;

  async validatePassword(password: string): Promise<boolean> {
    const query = await getRepository(User)
      .createQueryBuilder('user')
      .addSelect('user.password')
      .getRawOne();

    const userPassword = query['user_password'];

    const isValid = await argon2.verify(userPassword, password);

    return isValid;
  }
}
