import { Injectable, Logger, NotFoundException, ForbiddenException, InternalServerErrorException } from "@nestjs/common";
import { ApplicationsRepository } from "../domain/applications.repository.js";
import { CreateApplicationDto } from "./create-application.dto.js";
import { UpdateApplicationStatusDto } from "./update-status.dto.js";
import { Application, ApplicationStatus, ApplicationReview, ApplicationFindAll } from "../domain/application.entity.js";
import { ImagesPort } from "../domain/storage.port.js";
import { ConfigService } from "@nestjs/config";
import { v4 as uuidv4 } from 'uuid';
import { EmailSenderPort, EmailTemplate } from "../domain/email-sender.port.js";

@Injectable()
export class ApplicationsService {
    private readonly logger = new Logger(ApplicationsService.name);

    constructor(
        private readonly repository: ApplicationsRepository,
        private readonly imagesPort: ImagesPort,
        private readonly configService: ConfigService,
        private readonly emailService: EmailSenderPort,
    ) {}
    
    async createApplication(createApplicationDto: CreateApplicationDto): Promise<{ application: Application, uploadLinks: string[] }> {
        const date = new Date();
        const applicationId = uuidv4();
        let uploadLinks: string[] = [];
        let imagePaths: string[] = [];

        if (createApplicationDto.amountImages && createApplicationDto.amountImages > 0) {
            const bucketName = this.configService.get<string>('BUCKET_NAME_PUBLIC') || 'adogme-applications-compressed';
            const imageIds = Array.from({ length: createApplicationDto.amountImages }, (_, i) => `foto${i + 1}`);
            
            // Store the full paths in the application
            imagePaths = imageIds.map(imageId => `https://storage.googleapis.com/${bucketName}/${applicationId}/${imageId}.jpg`);
            
            // Generate the signed URLs using the port
            uploadLinks = await this.imagesPort.generateUploadLinks(applicationId, imageIds);
        }

        const application = Application.create({
            id: applicationId,
            applicantId: createApplicationDto.applicantId,
            dogId: createApplicationDto.dogId,
            shelterId: createApplicationDto.shelterId,
            dogName: createApplicationDto.dogName,
            dogBreed: createApplicationDto.dogBreed,
            dogImage: createApplicationDto.dogImage,
            shelterName: createApplicationDto.shelterName,
            shelterLogo: createApplicationDto.shelterLogo,
            applicantName: createApplicationDto.applicantName,
            formData: createApplicationDto.formData,
            formVersion: 1,
            status: ApplicationStatus.PENDING,
            compatibilityScore: createApplicationDto.compatibilityScore,
            images: imagePaths,
            reviews: [],
            createdAt: date,
            updatedAt: date,
        })

        await this.repository.create(application);
        await this.emailService.sendEmail({
            context: application,
            template: EmailTemplate.APPLICATION_REQUEST_RECEIVED,
            subject: "Nueva solicitud de adopción",
            to: "alanx015@hotmail.com"
        })

        return { application, uploadLinks };
    }

    async getApplicationById(id: string): Promise<Application> {
        this.logger.log(`Attempting to find application with ID: ${id}`);
        
        const application = await this.repository.findById(id);
        
        if (!application) {
            this.logger.warn(`Application with ID: ${id} was not found`);
            throw new NotFoundException(`Application with ID ${id} not found`);
        }

        this.logger.debug(`Successfully retrieved application with ID: ${id}`);
        return application;
    }

    async cancelApplication(id: string, applicantId: string): Promise<void> {
        this.logger.log(`Attempting to cancel application with ID: ${id} for applicant: ${applicantId}`);
        
        const application = await this.repository.findById(id);
        
        if (!application) {
            this.logger.warn(`Application with ID: ${id} was not found`);
            throw new NotFoundException(`Application with ID ${id} not found`);
        }

        if (application.applicantId !== applicantId) {
            this.logger.warn(`Applicant ${applicantId} is not authorized to cancel application ${id}`);
            throw new ForbiddenException(`You are not authorized to cancel this application`);
        }

        if (application.status === ApplicationStatus.CANCELLED) {
            return;
        }

        await this.repository.updateStatus(id, ApplicationStatus.CANCELLED);
        
        this.logger.debug(`Successfully cancelled application with ID: ${id}`);
    }

    async updateApplicationStatus(id: string, updateDto: UpdateApplicationStatusDto): Promise<void> {
        this.logger.log(`Attempting to update status for application: ${id} by shelter: ${updateDto.shelterId}`);
        
        const application = await this.repository.findById(id);
        
        if (!application) {
            this.logger.warn(`Application with ID: ${id} was not found`);
            throw new NotFoundException(`Application with ID ${id} not found`);
        }

        if (application.shelterId !== updateDto.shelterId) {
            this.logger.warn(`Shelter ${updateDto.shelterId} is not authorized to update application ${id}`);
            throw new ForbiddenException(`You are not authorized to update this application`);
        }

        if (application.status === updateDto.status) {
            this.logger.warn(`Application ${id} is already in status ${updateDto.status}`);
            return;
        }

        const review = ApplicationReview.create({
            id: uuidv4(),
            applicationId: id,
            fromStatus: application.status,
            toStatus: updateDto.status,
            note: updateDto.note || null,
            createdAt: new Date(),
        });

        await this.repository.updateStatus(id, updateDto.status, review);
        
        this.logger.debug(`Successfully updated status to ${updateDto.status} for application with ID: ${id}`);
    }

    async getMostRecentFormData(applicantId: string): Promise<any> {
        this.logger.log(`Fetching most recent application data for applicant: ${applicantId}`);
        const application = await this.repository.findMostRecentByApplicantId(applicantId);
        
        if (!application) {
            this.logger.warn(`No applications found for applicant ID: ${applicantId}`);
            throw new NotFoundException(`No applications found for applicant ID: ${applicantId}`);
        }

        if (application.applicantId !== applicantId) {
            this.logger.warn(`Applicant ${applicantId} is not authorized to get form data from application ${application.id}`);
            throw new ForbiddenException(`You are not authorized to get this application`);
        }

        return application.formData;
    }

    async checkNotExistingRequest(applicantId: string, dogId: string): Promise<{ exists: boolean, applicationId?: string }> {
        this.logger.log(`Checking existing application for applicant: ${applicantId} and dog: ${dogId}`);
        const applicationId = await this.repository.findByApplicantAndDogId(applicantId, dogId);
        
        if (applicationId) {
            return { exists: true, applicationId: applicationId };
        }
        
        return { exists: false };
    }

    async getApplicationsByApplicantId(applicantId: string, page: number, limit: number): Promise<{ data: ApplicationFindAll[], total: number, page: number, totalPages: number, limit: number }> {
        this.logger.log(`Fetching paginated applications for applicant: ${applicantId}, page: ${page}, limit: ${limit}`);
        
        const { data, total } = await this.repository.findAllByApplicantId(applicantId, page, limit);
        const totalPages = Math.ceil(total / limit);
        if (page > totalPages) {
                return {
                    data: [],
                    total,
                    page,
                    totalPages,
                    limit
                };
        }
        
        this.logger.debug(`Successfully retrieved ${data.length} applications for applicant: ${applicantId}`);
        return { data, total, page, totalPages, limit };
    }

    async getApplicationsByShelterId(shelterId: string, page: number, limit: number, status?: ApplicationStatus, search?: string): Promise<{ data: ApplicationFindAll[], total: number, page: number, totalPages: number, limit: number }> {
        this.logger.log(`Fetching paginated applications for shelter: ${shelterId}, page: ${page}, limit: ${limit}, status: ${status}, search: ${search}`);
        
        const { data, total } = await this.repository.findAllByShelterId(shelterId, page, limit, status, search);
        const totalPages = Math.ceil(total / limit);
        if (page > totalPages) {
            return {
                data: [],
                total,
                page,
                totalPages,
                limit
            };
        }
        this.logger.debug(`Successfully retrieved ${data.length} applications for shelter: ${shelterId}`);
        return { data, total, page, totalPages, limit };
    }

    async getShelterStats(shelterId: string): Promise<{
        recentApplications: ApplicationFindAll[],
        applicationsByStatus: {
          pending: number,
          in_review: number,
          approved: number,
          rejected: number,
          cancelled: number,
        }
      }> {
        this.logger.log(`Fetching shelter stats for shelter ${shelterId}`);
        try {
            const [recentApplications, applicationsByStatus] = await Promise.all([
                this.repository.findAllByShelterId(shelterId, 1, 5),
                this.repository.getApplicationsCountByStatus(shelterId)
            ]);
            return {
                recentApplications: recentApplications.data,
                applicationsByStatus
            };
        } catch (error) {
            this.logger.error(`Failed to fetch shelter stats: ${error.message}`, error.stack);
            throw new InternalServerErrorException('Failed to fetch shelter stats');
        }
    }

    async getChartStats(shelterId: string, period: 'semana' | 'mes' | 'año'): Promise<{ label: string, value: number }[]> {
        this.logger.log(`Fetching chart stats for shelter ${shelterId} and period ${period}`);
        
        const now = new Date();
        
        // Helper to get date locally in Mexico City
        const getMxDate = (d: Date) => new Date(d.toLocaleString("en-US", {timeZone: "America/Mexico_City"}));
        
        const nowMx = getMxDate(now);
        nowMx.setHours(0, 0, 0, 0);

        let startDate = new Date(now);
        if (period === 'semana') {
            startDate.setDate(startDate.getDate() - 8); // Extra day to be safe with timezones
        } else if (period === 'mes') {
            startDate.setDate(startDate.getDate() - 30);
        } else if (period === 'año') {
            startDate.setFullYear(startDate.getFullYear() - 1);
            startDate.setDate(startDate.getDate() - 5);
        }

        const applications = await this.repository.findCreatedAtByShelterId(shelterId, startDate);
        
        const buckets: { label: string, value: number, date?: Date, month?: number, year?: number }[] = [];

        if (period === 'semana') {
            const days = ['Dom', 'Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb'];
            for (let i = 6; i >= 0; i--) {
                const d = new Date(nowMx);
                d.setDate(d.getDate() - i);
                buckets.push({ label: days[d.getDay()], value: 0, date: d });
            }
            
            for (const app of applications) {
                const appMx = getMxDate(app.createdAt);
                appMx.setHours(0, 0, 0, 0);
                const diffDays = Math.floor((nowMx.getTime() - appMx.getTime()) / (1000 * 60 * 60 * 24));
                if (diffDays >= 0 && diffDays < 7) {
                    buckets[6 - diffDays].value++;
                }
            }
        } else if (period === 'mes') {
            buckets.push({ label: 'Sem 1', value: 0 });
            buckets.push({ label: 'Sem 2', value: 0 });
            buckets.push({ label: 'Sem 3', value: 0 });
            buckets.push({ label: 'Sem 4', value: 0 });

            for (const app of applications) {
                const appMx = getMxDate(app.createdAt);
                appMx.setHours(0, 0, 0, 0);
                const diffDays = Math.floor((nowMx.getTime() - appMx.getTime()) / (1000 * 60 * 60 * 24));
                if (diffDays >= 0 && diffDays < 28) {
                    const bucketIndex = 3 - Math.floor(diffDays / 7);
                    buckets[bucketIndex].value++;
                }
            }
        } else if (period === 'año') {
            const monthNames = ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic'];
            for (let i = 11; i >= 0; i--) {
                const d = new Date(nowMx);
                d.setMonth(d.getMonth() - i);
                buckets.push({ label: monthNames[d.getMonth()], value: 0, month: d.getMonth(), year: d.getFullYear() });
            }

            for (const app of applications) {
                const appMx = getMxDate(app.createdAt);
                const m = appMx.getMonth();
                const y = appMx.getFullYear();
                const bucket = buckets.find(b => b.month === m && b.year === y);
                if (bucket) {
                    bucket.value++;
                }
            }
        }

        return buckets.map(b => ({ label: b.label, value: b.value }));
    }
}