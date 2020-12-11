import { Exclude } from 'class-transformer/decorators';
import {
  BaseEntity,
  Column,
  Entity,
  PrimaryGeneratedColumn,
  Unique,
  getRepository,
  ManyToOne,
  ManyToMany,
} from 'typeorm';
import * as argon2 from 'argon2';
import { Room } from '../../rooms/entities/room.entity';

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
    const email = this.email;
    const user = await getRepository(User)
      .createQueryBuilder('user')
      .where('user.email = :email', { email })
      .addSelect('user.password')
      .getOne();

    const userPassword = user.password;

    const isValid = await argon2.verify(userPassword, password);

    return isValid;
  }
}
