import { Beer } from 'src/beers/beer.entity';
import { User } from 'src/users/entities/user.entity';
import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class Rating {
  @PrimaryGeneratedColumn()
  id: number;

  @Column('float')
  score: number;

  @ManyToOne(
    type => Beer,
    beer => beer.id,
  )
  beer: Beer;

  @ManyToOne(
    type => User,
    user => user.id,
  )
  evaluator: User;
}
