import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { ApplicationsController } from './applications.controller.js';
import { PrismaService } from './infrastructure/prisma/prisma.service.js';
import { ApplicantsController } from './applicants.controller.js';
import { ApplicantsService } from './application/applicants.service.js';
import { ApplicantsRepository } from './domain/applicants.repository.js';
import { PrismaApplicantsRepository } from './infrastructure/prisma/applicants.repository.prisma.js';
import { ApplicationsService } from './application/applications.service.js';
import { ApplicationsRepository } from './domain/applications.repository.js';
import { PrismaApplicationsRepository } from './infrastructure/prisma/applications.repository.prisma.js';
import { ImagesPort } from './domain/storage.port.js';
import { CloudStorageAdapter } from './infrastructure/cloud-storage/cloud.storage.adapter.js';
import { EmailSenderPort } from './domain/email-sender.port.js';
import { ResendEmailAdapter } from './infrastructure/email/resend-email.adapter.js';

@Module({
  imports: [ConfigModule.forRoot()],
  controllers: [ApplicationsController, ApplicantsController],
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
    {
      provide: ImagesPort,
      useClass: CloudStorageAdapter,
    },
    {
      provide: EmailSenderPort,
      useClass: ResendEmailAdapter,
    },
  ],
})
export class AppModule {}
