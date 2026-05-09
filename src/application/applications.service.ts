import { Injectable, Logger, NotFoundException, ForbiddenException } from "@nestjs/common";
import { ApplicationsRepository } from "../domain/applications.repository.js";
import { CreateApplicationDto } from "./create-application.dto.js";
import { UpdateApplicationStatusDto } from "./update-status.dto.js";
import { Application, ApplicationStatus, ApplicationReview } from "../domain/application.entity.js";
import { v4 as uuidv4 } from 'uuid';

@Injectable()
export class ApplicationsService {
    private readonly logger = new Logger(ApplicationsService.name);

    constructor(private readonly repository: ApplicationsRepository) {}
    
    async createApplication(createApplicationDto: CreateApplicationDto): Promise<string> {
        const date = new Date();
        const application = Application.create({
            id: uuidv4(),
            applicantId: createApplicationDto.applicantId,
            dogId: createApplicationDto.dogId,
            shelterId: createApplicationDto.shelterId,
            dogName: createApplicationDto.dogName,
            dogBreed: createApplicationDto.dogBreed,
            dogImage: createApplicationDto.dogImage,
            shelterName: createApplicationDto.shelterName,
            shelterLogo: createApplicationDto.shelterLogo,
            formData: createApplicationDto.formData,
            formVersion: 1,
            status: ApplicationStatus.PENDING,
            compatibilityScore: createApplicationDto.compatibilityScore,
            reviews: [],
            createdAt: date,
            updatedAt: date,
        })

        await this.repository.create(application);

        return application.id;
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
}