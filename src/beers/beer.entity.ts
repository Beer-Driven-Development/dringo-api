import { Room } from 'src/rooms/entities/room.entity';
import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class Beer {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column('float')
  abv: number;

  @ManyToOne(
    type => Room,
    room => room.id,
  )
  room: Room;
}
