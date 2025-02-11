import { IsString, IsNotEmpty, IsNumber, IsOptional, IsArray, IsUUID } from 'class-validator';

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
}
