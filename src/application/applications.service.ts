import { Injectable } from "@nestjs/common";
import { ApplicationsRepository } from "../domain/applications.repository.js";

@Injectable()
export class ApplicationsService {
    constructor(private readonly repository: ApplicationsRepository) {}
    
    getHello(): string {
        return 'Hello World!';
    }
}