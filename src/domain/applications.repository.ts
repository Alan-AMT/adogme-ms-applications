import { Application, ApplicationReview, ApplicationStatus, ApplicationFindAll } from "./application.entity.js";

export abstract class ApplicationsRepository {
    abstract create(application: Application): Promise<void>;
    abstract findById(id: string): Promise<Application | null>;
    abstract updateStatus(id: string, status: ApplicationStatus, applicationReview?: ApplicationReview): Promise<void>;
    abstract findMostRecentByApplicantId(applicantId: string): Promise<Application | null>;
    abstract findAllByApplicantId(applicantId: string, page: number, limit: number): Promise<{ items: ApplicationFindAll[], total: number }>;
    abstract findAllByShelterId(shelterId: string, page: number, limit: number, status?: ApplicationStatus): Promise<{ items: ApplicationFindAll[], total: number }>;
}