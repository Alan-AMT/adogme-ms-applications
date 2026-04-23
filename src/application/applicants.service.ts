import { Injectable, Logger, InternalServerErrorException } from '@nestjs/common';
import { v4 as uuidv4 } from 'uuid';
import { CreateApplicantDto } from './create-applicant.dto.js';
import { Applicant } from '../domain/applicant.entity.js';
import { ApplicantsRepository } from '../domain/applicants.repository.js';

@Injectable()
export class ApplicantsService {
    private readonly logger = new Logger(ApplicantsService.name);

    constructor(
        private readonly repository: ApplicantsRepository,
    ) {}

    async createApplicant(dto: CreateApplicantDto): Promise<Applicant> {
        try {
            const id = uuidv4();
            const now = new Date();

            const applicantInstance = Applicant.create({
                id,
                userId: dto.userId,
                userName: dto.userName,
                address: dto.address,
                postalCode: dto.postalCode,
                phone: dto.phone,
                email: dto.email,
                avatarUrl: dto.avatarUrl,
                vector: dto.vector ?? [],
                createdAt: now,
                updatedAt: now,
            });

            await this.repository.create(applicantInstance);

            return applicantInstance;
        } catch (error) {
            this.logger.error(`Failed to create applicant business logic: ${error.message}`, error.stack);
            if (error instanceof InternalServerErrorException) {
                throw error;
            }
            throw new InternalServerErrorException('Failed to process applicant creation');
        }
    }
}
