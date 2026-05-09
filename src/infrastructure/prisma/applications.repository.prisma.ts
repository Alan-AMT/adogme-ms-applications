import { Injectable } from "@nestjs/common";
import { ApplicationsRepository } from "../../domain/applications.repository.js";
import { PrismaService } from "./prisma.service.js";
import { Application, ApplicationReview, ApplicationStatus, ApplicationFindAll } from "../../domain/application.entity.js";

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

    async updateStatus(id: string, status: ApplicationStatus, applicationReview?: ApplicationReview): Promise<void> {
        await this.prisma.application.update({
            where: { id },
            data: {
                status,
                updatedAt: new Date(),
                ...(applicationReview && {
                    reviews: {
                        create: {
                            id: applicationReview.id,
                            fromStatus: applicationReview.fromStatus,
                            toStatus: applicationReview.toStatus,
                            note: applicationReview.note,
                            createdAt: applicationReview.createdAt,
                        }
                    }
                })
            },
        });
    }

    async findMostRecentByApplicantId(applicantId: string): Promise<Application | null> {
        const application = await this.prisma.application.findFirst({
            where: { applicantId },
            orderBy: { createdAt: 'desc' },
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
            reviews: [],
            createdAt: application.createdAt,
            updatedAt: application.updatedAt,
        });
    }

    async findAllByApplicantId(applicantId: string, page: number, limit: number): Promise<{ items: ApplicationFindAll[], total: number }> {
        const skip = (page - 1) * limit;
        
        const [items, total] = await Promise.all([
            this.prisma.application.findMany({
                where: { applicantId },
                select: {
                    id: true,
                    dogName: true,
                    dogBreed: true,
                    dogImage: true,
                    shelterName: true,
                    shelterLogo: true,
                    status: true,
                },
                orderBy: { createdAt: 'desc' },
                skip,
                take: limit,
            }),
            this.prisma.application.count({
                where: { applicantId },
            }),
        ]);

        return {
            items: items as ApplicationFindAll[],
            total,
        };
    }

    async findAllByShelterId(shelterId: string, page: number, limit: number, status?: ApplicationStatus): Promise<{ items: ApplicationFindAll[], total: number }> {
        const skip = (page - 1) * limit;
        
        const whereClause = {
            shelterId,
            ...(status ? { status } : {}),
        };

        const [items, total] = await Promise.all([
            this.prisma.application.findMany({
                where: whereClause,
                select: {
                    id: true,
                    dogName: true,
                    dogBreed: true,
                    dogImage: true,
                    shelterName: true,
                    shelterLogo: true,
                    status: true,
                },
                orderBy: { createdAt: 'desc' },
                skip,
                take: limit,
            }),
            this.prisma.application.count({
                where: whereClause,
            }),
        ]);

        return {
            items: items as ApplicationFindAll[],
            total,
        };
    }
}