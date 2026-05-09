import { IsEnum, IsNotEmpty, IsOptional, IsString, IsUUID } from 'class-validator';
import { ApplicationStatus } from '../domain/application.entity.js';

export class UpdateApplicationStatusDto {
    @IsUUID()
    @IsNotEmpty()
    shelterId: string;

    @IsEnum(ApplicationStatus)
    @IsNotEmpty()
    status: ApplicationStatus;

    @IsString()
    @IsOptional()
    note?: string;
}
