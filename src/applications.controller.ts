import { Body, Controller, Get, Post, Delete, Patch, UseGuards, UsePipes, ValidationPipe, Param, ParseUUIDPipe, Logger } from '@nestjs/common';
import { Roles } from './infrastructure/security/roles.decorator.js';
import { UserAuthorizationGuard } from './infrastructure/security/user.authorization.guard.js';
import { ApplicationsService } from './application/applications.service.js';
import { CreateApplicationDto } from './application/create-application.dto.js';
import { Application } from './domain/application.entity.js';
import { UpdateApplicationStatusDto } from './application/update-status.dto.js';

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

  @UseGuards(UserAuthorizationGuard)
  @Roles("applicant")
  @Delete(':id')
  async cancel(
    @Param('id', ParseUUIDPipe) id: string,
    @Body('applicantId') applicantId: string
  ): Promise<void> {
    this.logger.log(`DELETE request received to cancel application with ID: ${id}`);
    await this.applicationsService.cancelApplication(id, applicantId);
  }

  @UseGuards(UserAuthorizationGuard)
  @Roles("shelter")
  @Patch(':id/status')
  async updateStatus(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() updateDto: UpdateApplicationStatusDto
  ): Promise<void> {
    this.logger.log(`PATCH request received to update status for application with ID: ${id}`);
    await this.applicationsService.updateApplicationStatus(id, updateDto);
  }

  @UseGuards(UserAuthorizationGuard)
  @Roles("applicant")
  @Get('recent/:applicantId')
  async getRecentFormData(@Param('applicantId', ParseUUIDPipe) applicantId: string): Promise<any> {
    this.logger.log(`GET request received to retrieve recent form data for applicant: ${applicantId}`);
    return await this.applicationsService.getMostRecentFormData(applicantId);
  }
}
