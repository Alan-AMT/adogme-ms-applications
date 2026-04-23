import { Body, Controller, Post, HttpCode, HttpStatus, Logger } from '@nestjs/common';
import { ApplicantsService } from './applicants.service.js';
import { CreateApplicantDto } from './create-applicant.dto.js';
import { Applicant } from 'src/domain/applicant.entity.js';

@Controller('applicant')
export class ApplicantsController {
    private readonly logger = new Logger(ApplicantsController.name);

    constructor(private readonly applicantsService: ApplicantsService) {}

    @Post()
    @HttpCode(HttpStatus.CREATED)
    async createApplicant(@Body() dto: CreateApplicantDto): Promise<Applicant> {
        return await this.applicantsService.createApplicant(dto);
    }
}
