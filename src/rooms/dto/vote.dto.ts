import { IsNotEmpty } from 'class-validator';
import { Beer } from '../../beers/beer.entity';
import { Pivot } from '../../categories/pivot.entity';

export class VoteDto {
  @IsNotEmpty()
  score: number;
  @IsNotEmpty()
  beerId: number;
  @IsNotEmpty()
  pivotId: number;
}
