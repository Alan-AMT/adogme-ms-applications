import {
  IsJSON,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
} from 'class-validator';

export class CreateApplicationDto {
  @IsString()
  @IsNotEmpty()
  applicantId: string;

  @IsString()
  @IsNotEmpty()
  dogId: string;

  @IsString()
  @IsNotEmpty()
  shelterId: string;

  @IsString()
  @IsNotEmpty()
  dogName: string;

  @IsString()
  @IsNotEmpty()
  dogBreed: string;

  @IsOptional()
  @IsString()
  dogImage: string | null = null;

  @IsString()
  @IsNotEmpty()
  shelterName: string;

  @IsOptional()
  @IsString()
  shelterLogo: string | null = null;

  @IsString()
  @IsNotEmpty()
  applicantName: string;

  @IsString()
  @IsNotEmpty()
  applicantEmail: string;

  @IsNotEmpty()
  formData: any;

  @IsOptional()
  @IsNumber()
  compatibilityScore: number | null = null;

  @IsOptional()
  @IsNumber()
  amountImages: number | null = null;
}
