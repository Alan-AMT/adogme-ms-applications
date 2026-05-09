import { Body, Controller, Get, Post, Delete, Patch, UseGuards, UsePipes, ValidationPipe, Param, ParseUUIDPipe, Logger, Query } from '@nestjs/common';
import { Roles } from './infrastructure/security/roles.decorator.js';
import { UserAuthorizationGuard } from './infrastructure/security/user.authorization.guard.js';
import { ApplicationsService } from './application/applications.service.js';
import { CreateApplicationDto } from './application/create-application.dto.js';
import { Application, ApplicationFindAll } from './domain/application.entity.js';
import { UpdateApplicationStatusDto } from './application/update-status.dto.js';
import { GetApplicationsQueryDto } from './application/get-applications-query.dto.js';

@Controller('applications-ms')
@UsePipes(new ValidationPipe({ transform: true }))
@UseGuards(UserAuthorizationGuard)
export class ApplicationsController {
  private readonly logger = new Logger(ApplicationsController.name);

  constructor(private readonly applicationsService: ApplicationsService) {}
  
  @Roles("applicant")
  @Post()
  async create(@Body() createApplicationDto: CreateApplicationDto): Promise<string> {
    return this.applicationsService.createApplication(createApplicationDto);
  }

  @Roles("applicant", "shelter")
  @Get(':id')
  async getById(@Param('id', ParseUUIDPipe) id: string): Promise<Application> {
    this.logger.log(`GET request received to retrieve application with ID: ${id}`);
    return this.applicationsService.getApplicationById(id);
  }

  @Roles("applicant")
  @Delete(':id')
  async cancel(
    @Param('id', ParseUUIDPipe) id: string,
    @Body('applicantId') applicantId: string
  ): Promise<void> {
    this.logger.log(`DELETE request received to cancel application with ID: ${id}`);
    await this.applicationsService.cancelApplication(id, applicantId);
  }

  @Roles("shelter")
  @Patch(':id/status')
  async updateStatus(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() updateDto: UpdateApplicationStatusDto
  ): Promise<void> {
    this.logger.log(`PATCH request received to update status for application with ID: ${id}`);
    await this.applicationsService.updateApplicationStatus(id, updateDto);
  }

  @Roles("applicant")
  @Get('applicant/:applicantId/recent')
  async getRecentFormData(@Param('applicantId', ParseUUIDPipe) applicantId: string): Promise<any> {
    this.logger.log(`GET request received to retrieve recent form data for applicant: ${applicantId}`);
    return this.applicationsService.getMostRecentFormData(applicantId);
  }

  @Roles("applicant")
  @Get('applicant/:applicantId')
  async getApplicationsByApplicant(
    @Param('applicantId', ParseUUIDPipe) applicantId: string,
    @Query() query: GetApplicationsQueryDto,
  ): Promise<{ data: ApplicationFindAll[], total: number, page: number, totalPages: number, limit: number }> {
    this.logger.log(`GET request received to retrieve paginated applications for applicant: ${applicantId}`);
    return this.applicationsService.getApplicationsByApplicantId(applicantId, query.page, query.limit);
  }

  @Roles("shelter")
  @Get('shelter/:shelterId')
  async getApplicationsByShelter(
    @Param('shelterId', ParseUUIDPipe) shelterId: string,
    @Query() query: GetApplicationsQueryDto,
  ): Promise<{ data: ApplicationFindAll[], total: number, page: number, totalPages: number, limit: number }> {
    this.logger.log(`GET request received to retrieve paginated applications for shelter: ${shelterId}`);
    return this.applicationsService.getApplicationsByShelterId(shelterId, query.page, query.limit, query.status);
  }

  @Roles('shelter')
  @Get("shelter/:shelterId/stats")
  async getShelterStats(
    @Param('shelterId') shelterId: string,
  ): Promise<
    {
      recentApplications: ApplicationFindAll[],
      applicationsByStatus: {
        pending: number,
        in_review: number,
        approved: number,
        rejected: number,
        cancelled: number,
      }
    }
  > {
    return this.applicationsService.getShelterStats(shelterId);
  }
}
