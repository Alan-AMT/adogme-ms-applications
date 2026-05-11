import { Type } from 'class-transformer';
import { IsInt, IsOptional, Min, IsEnum } from 'class-validator';
import { ApplicationStatus } from '../domain/application.entity.js';

export class GetApplicationsQueryDto {
    @IsOptional()
    @Type(() => Number)
    @IsInt()
    @Min(1)
    page: number = 1;

    @IsOptional()
    @Type(() => Number)
    @IsInt()
    @Min(1)
    limit: number = 12;

    @IsOptional()
    @IsEnum(ApplicationStatus)
    status?: ApplicationStatus;

    @IsOptional()
    search?: string;
}
