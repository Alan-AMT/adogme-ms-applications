import { Injectable } from "@nestjs/common";
import { ApplicationsRepository } from "../../domain/applications.repository.js";
import { PrismaService } from "./prisma.service.js";
import { Application, ApplicationReview, ApplicationStatus } from "../../domain/application.entity.js";

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

    async findById(id: string): Promise<Application | null> {
        const application = await this.prisma.application.findUnique({
            where: { id },
            include: {
                reviews: {
                    orderBy: {
                        createdAt: 'asc',
                    },
                },
            },
        });

        if (!application) {
            return null;
        }

        return Application.create({
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
            status: application.status as ApplicationStatus,
            compatibilityScore: application.compatibilityScore,
            reviews: application.reviews.map((review) => ApplicationReview.create({
                id: review.id,
                applicationId: review.applicationId,
                fromStatus: review.fromStatus as ApplicationStatus,
                toStatus: review.toStatus as ApplicationStatus,
                note: review.note,
                createdAt: review.createdAt,
            })),
            createdAt: application.createdAt,
            updatedAt: application.updatedAt,
        });
    }
}