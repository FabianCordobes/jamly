import { IsString, IsNotEmpty, IsNumber, IsOptional, IsArray, IsUUID, Matches } from 'class-validator';

export class CreateSpaceDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsString()
  @IsNotEmpty()
  description: string;

  @IsString()
  @IsNotEmpty()
  location: string;

  @IsNumber()
  pricePerHour: number;

  @IsArray()
  @IsOptional()
  equipment?: string[];

  @IsUUID()
  ownerId: string;

  @IsOptional()
  @Matches(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/, { message: 'Formato de hora inválido. Usa HH:mm' })
  openTime?: string;

  @IsOptional()
  @Matches(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/, { message: 'Formato de hora inválido. Usa HH:mm' })
  closeTime?: string;
}
