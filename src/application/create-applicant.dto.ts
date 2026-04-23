import { IsArray, IsNotEmpty, IsNumber, IsOptional, IsString } from 'class-validator';

export class CreateApplicantDto {
    @IsString()
    @IsNotEmpty()
    userId: string;

    @IsString()
    @IsNotEmpty()
    userName: string;

    @IsString()
    @IsNotEmpty()
    address: string;

    @IsString()
    @IsNotEmpty()
    postalCode: string;

    @IsOptional()
    @IsString()
    phone: string | null = null;

    @IsOptional()
    @IsString()
    email: string | null = null;

    @IsOptional()
    @IsString()
    avatarUrl: string | null = null;

    @IsOptional()
    @IsArray()
    @IsNumber({}, { each: true })
    vector: number[] | null = null;
}
