import { Application } from "./application.entity.js";

export abstract class ApplicationsRepository {
    abstract create(application: Application): Promise<void>;
    abstract findById(id: string): Promise<Application | null>;
}