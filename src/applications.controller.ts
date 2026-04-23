import { Controller, Get, UseGuards, UsePipes, ValidationPipe } from '@nestjs/common';
import { User } from './infrastructure/security/user.decorator.js';
import { Roles } from './infrastructure/security/roles.decorator.js';
import { UserAuthorizationGuard } from './infrastructure/security/user.authorization.guard.js';
import { ApplicationsService } from './application/applications.service.js';

@Controller('applications-ms')
@UsePipes(new ValidationPipe({ transform: true }))
export class ApplicationsController {
  constructor(private readonly applicationsService: ApplicationsService) {}
  
  // @UseGuards(UserAuthorizationGuard)
  @Get()
  getHello(): string {
    return this.applicationsService.getHello();
  }
}
