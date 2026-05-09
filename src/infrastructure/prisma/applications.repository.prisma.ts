import { Injectable } from "@nestjs/common";
import { ApplicationsRepository } from "../../domain/applications.repository.js";
import { PrismaService } from "./prisma.service.js";
import { Application } from "../../domain/application.entity.js";

@Injectable()
export class PrismaApplicationsRepository implements ApplicationsRepository {
    constructor(private readonly prisma: PrismaService) {}
    
    async create(application: Application): Promise<void> {
        await this.prisma.application.create({
            data: {
                id: application.id,
                applicantId: application.applicantId,
                dogId: application.dogId,
                shelterId: application.shelterId,
                dogName: application.dogName,
                dogBreed: application.dogBreed,
                dogImage: application.dogImage,
                shelterName: application.shelterName,
                shelterLogo: application.shelterLogo,
                formData: application.formData,
                formVersion: application.formVersion,
                status: application.status,
                compatibilityScore: application.compatibilityScore,
                createdAt: application.createdAt,
                updatedAt: application.updatedAt,
            },
        });
    }
}