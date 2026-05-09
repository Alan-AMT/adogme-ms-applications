import { Injectable } from "@nestjs/common";
import { ApplicationsRepository } from "../domain/applications.repository.js";
import { CreateApplicationDto } from "./create-application.dto.js";
import { Application } from "src/domain/application.entity.js";
import { v4 as uuidv4 } from 'uuid';
import { ApplicationStatus } from "src/domain/application.entity.js";

@Injectable()
export class ApplicationsService {
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
            createdAt: date,
            updatedAt: date,
        })

        await this.repository.create(application);

        return application.id;
    }
}