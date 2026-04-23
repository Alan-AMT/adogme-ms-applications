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
                    id: applicant.id,
                    userId: applicant.userId,
                    userName: applicant.userName,
                    address: applicant.address,
                    postalCode: applicant.postalCode,
                    phone: applicant.phone,
                    email: applicant.email,
                    avatarUrl: applicant.avatarUrl,
                    vector: applicant.vector,
                    createdAt: applicant.createdAt,
                    updatedAt: applicant.updatedAt,
                }
            });
        } catch (error) {
            this.logger.error(`Failed to create Applicant in database: ${error.message}`, error.stack);
            throw new InternalServerErrorException('An error occurred while creating the applicant');
        }
    }
}
