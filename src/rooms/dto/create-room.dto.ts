import { IsNotEmpty } from 'class-validator';

export class CreateRoomDto {
  @IsNotEmpty()
  name: string;
  @IsNotEmpty()
  passcode: string;
}
