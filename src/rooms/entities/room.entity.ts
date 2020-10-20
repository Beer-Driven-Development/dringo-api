import {
  Column,
  Entity,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { User } from '../../users/entities/user.entity';

@Entity()
export class Room {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column()
  passcode: string;

  @ManyToOne(
    type => User,
    user => user.id,
  )
  creator: User;

  @OneToMany(
    type => User,
    user => user.id,
  )
  participants: User[];
}
