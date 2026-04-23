import { Injectable, InternalServerErrorException, Logger } from "@nestjs/common";
import { ApplicantsRepository } from "../../domain/applicants.repository.js";
import { PrismaService } from "./prisma.service.js";
import { Applicant } from "../../domain/applicant.entity.js";

@Injectable()
export class PrismaApplicantsRepository implements ApplicantsRepository {
    private readonly logger = new Logger(PrismaApplicantsRepository.name);
    
    constructor(private readonly prisma: PrismaService) {}
    
    async create(applicant: Applicant): Promise<void> {
        try {
            await this.prisma.applicant.create({
                data: {
                    ...applicant
                }
            });
        } catch (error) {
            this.logger.error(`Failed to create Applicant in database: ${error.message}`, error.stack);
            throw new InternalServerErrorException('An error occurred while creating the applicant');
        }
    }

    async findById(id: string): Promise<Applicant | null> {
        try {
            const raw = await this.prisma.applicant.findUnique({
                where: { id }
            });
            
            if (!raw) return null;

            return Applicant.create({
                ...raw
            });
        } catch (error) {
            this.logger.error(`Failed to find Applicant by id in database: ${error.message}`, error.stack);
            throw new InternalServerErrorException('An error occurred while fetching the applicant');
        }
    }

    async findByUserId(userId: string): Promise<Applicant | null> {
        try {
            const raw = await this.prisma.applicant.findUnique({
                where: { userId } // userId is @unique in schema.prisma!
            });
            
            if (!raw) return null;

            return Applicant.create({
                ...raw
            });
        } catch (error) {
            this.logger.error(`Failed to find Applicant by userId in database: ${error.message}`, error.stack);
            throw new InternalServerErrorException('An error occurred while fetching the applicant');
        }
    }

    async update(applicant: Applicant): Promise<void> {
        try {
            const {userId, createdAt, ...rest} = applicant;
            await this.prisma.applicant.update({
                where: { id: applicant.id },
                data: {
                    ...rest
                }
            });
        } catch (error) {
            this.logger.error(`Failed to update Applicant in database: ${error.message}`, error.stack);
            throw new InternalServerErrorException('An error occurred while updating the applicant');
        }
    }
}
