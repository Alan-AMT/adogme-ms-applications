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
                applicantName: application.applicantName,
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
            ...application,
            status: application.status as ApplicationStatus,
            reviews: application.reviews.map((review) => ApplicationReview.create({
                id: review.id,
                applicationId: review.applicationId,
                fromStatus: review.fromStatus as ApplicationStatus,
                toStatus: review.toStatus as ApplicationStatus,
                note: review.note,
                createdAt: review.createdAt,
            })),
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
            ...application,
            reviews: [],
            status: application.status as ApplicationStatus,
        });
    }

    async findByApplicantAndDogId(applicantId: string, dogId: string): Promise<Application | null> {
        const application = await this.prisma.application.findFirst({
            where: { applicantId, dogId },
        });

        if (!application) {
            return null;
        }

        return Application.create({
            ...application,
            reviews: [],
            status: application.status as ApplicationStatus,
        });
    }

    async findAllByApplicantId(applicantId: string, page: number, limit: number): Promise<{ data: ApplicationFindAll[], total: number }> {
        const skip = (page - 1) * limit;
        
        const [data, total] = await Promise.all([
            this.prisma.application.findMany({
                where: { applicantId },
                select: {
                    id: true,
                    dogName: true,
                    dogBreed: true,
                    dogImage: true,
                    shelterName: true,
                    shelterLogo: true,
                    applicantName: true,
                    status: true,
                    createdAt: true,
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
            data: data as ApplicationFindAll[],
            total,
        };
    }

    async findAllByShelterId(shelterId: string, page: number, limit: number, status?: ApplicationStatus, search?: string): Promise<{ data: ApplicationFindAll[], total: number }> {
        const skip = (page - 1) * limit;
        
        const whereClause: any = {
            shelterId,
            ...(status ? { status } : {}),
        };

        if (search) {
            whereClause.OR = [
                { dogName: { contains: search, mode: 'insensitive' } },
                { applicantName: { contains: search, mode: 'insensitive' } },
            ];
        }

        const [data, total] = await Promise.all([
            this.prisma.application.findMany({
                where: whereClause,
                select: {
                    id: true,
                    dogName: true,
                    dogBreed: true,
                    dogImage: true,
                    shelterName: true,
                    shelterLogo: true,
                    applicantName: true,
                    status: true,
                    createdAt: true,
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
            data: data as ApplicationFindAll[],
            total,
        };
    }

    async getApplicationsCountByStatus(shelterId: string): Promise<{
        pending: number,
        in_review: number,
        approved: number,
        rejected: number,
        cancelled: number,
    }> {
        const applications = await this.prisma.application.groupBy({
            by: ['status'],
            where: { shelterId },
            _count: true
        });
        const count = applications.reduce((acc, application) => {
            acc[application.status] = application._count;
            return acc;
        }, {
            pending: 0,
            in_review: 0,
            approved: 0,
            rejected: 0,
            cancelled: 0,
        });
        return count;
    }

    async findCreatedAtByShelterId(shelterId: string, since: Date): Promise<{ createdAt: Date }[]> {
        return this.prisma.application.findMany({
            where: {
                shelterId,
                createdAt: {
                    gte: since,
                },
            },
            select: {
                createdAt: true,
            },
        });
    }
}