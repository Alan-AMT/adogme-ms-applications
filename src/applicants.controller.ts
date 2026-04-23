import { Body, Controller, Post, Put, Param, HttpCode, HttpStatus, Logger, ValidationPipe, UsePipes, UseGuards } from '@nestjs/common';
import { ApplicantsService } from './application/applicants.service.js';
import { CreateApplicantDto } from './application/create-applicant.dto.js';
import { UpdateApplicantDto } from './application/update-applicant.dto.js';
import { Applicant } from 'src/domain/applicant.entity.js';
import { User } from './infrastructure/security/user.decorator.js';
import { UserAuthorizationGuard } from './infrastructure/security/user.authorization.guard.js';
import { Roles } from './infrastructure/security/roles.decorator.js';

@Controller('applicants-ms')
@UsePipes(new ValidationPipe({ transform: true }))
export class ApplicantsController {
    constructor(private readonly applicantsService: ApplicantsService) {}

    @UseGuards(UserAuthorizationGuard)
    @Roles('applicant')
    @Post('applicant')
    @HttpCode(HttpStatus.CREATED)
    async createApplicant(@Body() dto: CreateApplicantDto, @User('sub') userId: string): Promise<Applicant> {
        return await this.applicantsService.createApplicant(dto, userId);
    }

    @UseGuards(UserAuthorizationGuard)
    @Roles('applicant')
    @Put('applicant/:id')
    async updateApplicant(
        @Param('id') applicantId: string,
        @User('sub') userId: string,
        @Body() dto: UpdateApplicantDto
    ): Promise<Applicant> {
        return await this.applicantsService.updateApplicant(applicantId, userId, dto);
    }
}
