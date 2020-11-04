import { Room } from 'src/rooms/entities/room.entity';
import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { Category } from './category.entity';

@Entity()
export class Pivot {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  weight: number;

  @ManyToOne(
    type => Category,
    category => category.id,
  )
  category: Category;

  @ManyToOne(
    type => Room,
    room => room.id,
  )
  room: Room;
}
