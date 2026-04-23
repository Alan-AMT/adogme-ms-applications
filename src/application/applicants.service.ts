import { Injectable, Logger, InternalServerErrorException, NotFoundException, ForbiddenException } from '@nestjs/common';
import { v4 as uuidv4 } from 'uuid';
import { CreateApplicantDto } from './create-applicant.dto.js';
import { UpdateApplicantDto } from './update-applicant.dto.js';
import { Applicant } from '../domain/applicant.entity.js';
import { ApplicantsRepository } from '../domain/applicants.repository.js';

@Injectable()
export class ApplicantsService {
    private readonly logger = new Logger(ApplicantsService.name);

    constructor(
        private readonly repository: ApplicantsRepository,
    ) {}

    async createApplicant(dto: CreateApplicantDto, userId: string): Promise<Applicant> {
        try {
            const id = uuidv4();
            const now = new Date();

            const applicantInstance = Applicant.create({
                id,
                userId: userId,
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

    async updateApplicant(applicantId: string, tokenUserId: string, dto: UpdateApplicantDto): Promise<Applicant> {
        try {
            const currentApplicant = await this.repository.findById(applicantId);
            
            if (!currentApplicant) {
                throw new NotFoundException(`Applicant with ID ${applicantId} not found`);
            }

            if (currentApplicant.userId !== tokenUserId) {
                throw new ForbiddenException('You do not have permission to update this applicant');
            }

            const updatedApplicant = Applicant.create({
                ...currentApplicant,
                ...dto,
                vector: dto.vector ?? [],
                updatedAt: new Date(),
                createdAt: currentApplicant.createdAt,
            });

            await this.repository.update(updatedApplicant);

            return updatedApplicant;
        } catch (error) {
            this.logger.error(`Failed to update applicant business logic: ${error.message}`, error.stack);
            if (error instanceof NotFoundException || error instanceof ForbiddenException) {
                throw error;
            }
            throw new InternalServerErrorException('Failed to process applicant update');
        }
    }

    async getApplicantById(applicantId: string): Promise<Applicant> {
        try {
            const applicant = await this.repository.findById(applicantId);
            if (!applicant) {
                throw new NotFoundException(`Applicant with ID ${applicantId} not found`);
            }
            return applicant;
        } catch (error) {
            this.logger.error(`Failed to get applicant by id: ${error.message}`, error.stack);
            if (error instanceof NotFoundException) {
                throw error;
            }
            throw new InternalServerErrorException('Failed to fetch applicant');
        }
    }

    async getApplicantByUserId(userId: string): Promise<Applicant> {
        try {
            const applicant = await this.repository.findByUserId(userId);
            if (!applicant) {
                throw new NotFoundException(`Applicant for user ${userId} not found`);
            }
            return applicant;
        } catch (error) {
            this.logger.error(`Failed to get applicant by user id: ${error.message}`, error.stack);
            if (error instanceof NotFoundException) {
                throw error;
            }
            throw new InternalServerErrorException('Failed to fetch applicant');
        }
    }
}
