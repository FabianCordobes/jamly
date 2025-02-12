import { IsDateString, IsNotEmpty, IsNumber, IsUUID } from 'class-validator';

export class CreateBookingDto {
  @IsDateString()
  @IsNotEmpty()
  startTime: Date;

  @IsDateString()
  @IsNotEmpty()
  endTime: Date;

  @IsNotEmpty()
  @IsUUID()
  artistId: string;
  
  @IsNotEmpty()
  @IsUUID()
  spaceId: string;
}
