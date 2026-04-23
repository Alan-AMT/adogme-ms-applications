import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AppController } from './app.controller.js';
import { PrismaService } from './infrastructure/prisma/prisma.service.js';
import { ApplicantsController } from './application/applicants.controller.js';
import { ApplicantsService } from './application/applicants.service.js';
import { ApplicantsRepository } from './domain/applicants.repository.js';
import { PrismaApplicantsRepository } from './infrastructure/prisma/applicants.repository.prisma.js';
import { ApplicationsService } from './application/applications.service.js';
import { ApplicationsRepository } from './domain/applications.repository.js';
import { PrismaApplicationsRepository } from './infrastructure/prisma/applications.repository.prisma.js';

@Module({
  imports: [ConfigModule.forRoot()],
  controllers: [AppController, ApplicantsController],
  providers: [
    PrismaService,
    ApplicationsService,
    ApplicantsService,
    {
      provide: ApplicantsRepository,
      useClass: PrismaApplicantsRepository,
    },
    {
      provide: ApplicationsRepository,
      useClass: PrismaApplicationsRepository,
    },
  ],
})
export class AppModule {}
