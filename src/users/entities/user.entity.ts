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

  @Column({ select: false, nullable: true })
  @Exclude()
  password: string;

  @Column({ select: false, nullable: true })
  @Exclude()
  salt: string;

  @Column({ nullable: true })
  username: string;

  async validatePassword(password: string): Promise<boolean> {
    const query = await getRepository(User)
      .createQueryBuilder('user')
      .addSelect('user.password')
      .addSelect('user.salt')
      .getRawOne();

    const salt = query['user_salt'];
    const userPassword = query['user_password'];
    const isValid = await bcrypt.compare(password, userPassword);

    return isValid;
  }
}
