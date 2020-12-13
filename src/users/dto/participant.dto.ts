import { IsEmail, IsNotEmpty } from 'class-validator';

export class ParticipantDto {
  @IsEmail()
  email: string;
  @IsNotEmpty()
  id: number;
  @IsNotEmpty()
  username: string;
}
