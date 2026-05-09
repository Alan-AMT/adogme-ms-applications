import { Application, ApplicationReview, ApplicationStatus } from "./application.entity.js";

export abstract class ApplicationsRepository {
    abstract create(application: Application): Promise<void>;
    abstract findById(id: string): Promise<Application | null>;
    abstract updateStatus(id: string, status: ApplicationStatus, applicationReview?: ApplicationReview): Promise<void>;
}