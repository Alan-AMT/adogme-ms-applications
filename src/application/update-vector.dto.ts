import { IsArray, IsNumber } from 'class-validator';

export class UpdateVectorDto {
    @IsArray()
    @IsNumber({}, { each: true })
    vector: number[];
}
