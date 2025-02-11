import { IsDateString, IsNotEmpty, IsNumber, IsUUID } from 'class-validator';

export class CreateBookingDto {
  @IsDateString()
  @IsNotEmpty()
  startTime: Date;

  @IsDateString()
  @IsNotEmpty()
  endTime: Date;

  @IsUUID()
  artistId: string;

  @IsUUID()
  spaceId: string;
}
