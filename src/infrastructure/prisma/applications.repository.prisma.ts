import { Injectable } from "@nestjs/common";
import { ApplicationsRepository } from "../../domain/applications.repository.js";
import { PrismaService } from "./prisma.service.js";

@Injectable()
export class PrismaApplicationsRepository implements ApplicationsRepository {
    constructor(private readonly prisma: PrismaService) {}
    
    async create(): Promise<void> {
        throw new Error("Method not implemented.");
    }
}