import { Injectable, Logger, NotFoundException } from "@nestjs/common";
import { ApplicationsRepository } from "../domain/applications.repository.js";
import { CreateApplicationDto } from "./create-application.dto.js";
import { Application } from "src/domain/application.entity.js";
import { v4 as uuidv4 } from 'uuid';
import { ApplicationStatus } from "src/domain/application.entity.js";

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
}