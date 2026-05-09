import { Body, Controller, Get, Post, UseGuards, UsePipes, ValidationPipe, Param, ParseUUIDPipe, Logger } from '@nestjs/common';
import { Roles } from './infrastructure/security/roles.decorator.js';
import { UserAuthorizationGuard } from './infrastructure/security/user.authorization.guard.js';
import { ApplicationsService } from './application/applications.service.js';
import { CreateApplicationDto } from './application/create-application.dto.js';
import { Application } from './domain/application.entity.js';

@Controller('applications-ms')
@UsePipes(new ValidationPipe({ transform: true }))
export class ApplicationsController {
  private readonly logger = new Logger(ApplicationsController.name);

  constructor(private readonly applicationsService: ApplicationsService) {}
  
  @UseGuards(UserAuthorizationGuard)
  @Roles("applicant")
  @Post()
  async create(@Body() createApplicationDto: CreateApplicationDto): Promise<string> {
    return await this.applicationsService.createApplication(createApplicationDto);
  }

  @UseGuards(UserAuthorizationGuard)
  @Roles("applicant", "shelter")
  @Get(':id')
  async getById(@Param('id', ParseUUIDPipe) id: string): Promise<Application> {
    this.logger.log(`GET request received to retrieve application with ID: ${id}`);
    return await this.applicationsService.getApplicationById(id);
  }
}
