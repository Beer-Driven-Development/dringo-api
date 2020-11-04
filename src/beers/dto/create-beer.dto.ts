import { IsNotEmpty, IsNumber } from 'class-validator';

export class CreateBeerDto {
  @IsNotEmpty()
  name: string;
  @IsNumber()
  abv: number;
}
