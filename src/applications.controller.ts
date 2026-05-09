import { Body, Controller, Get, Post, UseGuards, UsePipes, ValidationPipe } from '@nestjs/common';
import { Roles } from './infrastructure/security/roles.decorator.js';
import { UserAuthorizationGuard } from './infrastructure/security/user.authorization.guard.js';
import { ApplicationsService } from './application/applications.service.js';
import { CreateApplicationDto } from './application/create-application.dto.js';

@Controller('applications-ms')
@UsePipes(new ValidationPipe({ transform: true }))
export class ApplicationsController {
  constructor(private readonly applicationsService: ApplicationsService) {}
  
  @UseGuards(UserAuthorizationGuard)
  @Roles("applicant")
  @Post()
  async create(@Body() createApplicationDto: CreateApplicationDto): Promise<string> {
    return await this.applicationsService.createApplication(createApplicationDto);
  }
}
