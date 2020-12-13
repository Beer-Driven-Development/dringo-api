import { IsNotEmpty } from 'class-validator';
import { ParticipantDto } from '../../users/dto/participant.dto';

export class StartDto {
  @IsNotEmpty()
  participants: ParticipantDto[];
}
