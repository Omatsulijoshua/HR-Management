import {
  Controller,
  Get,
  Post,
  Patch,
  Body,
  Param,
  UseGuards,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { OnboardingService } from './onboarding.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { TenantGuard } from '../organizations/guards/tenant.guard';
import { GetUser } from '../auth/decorators/get-user.decorator';
import {
  CreateOnboardingTemplateDto,
  AssignOnboardingDto,
  UpdateTaskStatusDto,
} from './dto/onboarding.dto';

@ApiTags('Onboarding')
@Controller('onboarding')
@UseGuards(JwtAuthGuard, TenantGuard)
@ApiBearerAuth()
export class OnboardingController {
  constructor(private readonly onboardingService: OnboardingService) {}

  @Get('templates')
  @ApiOperation({ summary: 'List onboarding checklist templates' })
  async getTemplates(@GetUser('organizationId') orgId: string) {
    return this.onboardingService.getTemplates(orgId);
  }

  @Post('templates')
  @ApiOperation({ summary: 'Create new onboarding checklist template' })
  async createTemplate(
    @GetUser('organizationId') orgId: string,
    @Body() dto: CreateOnboardingTemplateDto,
  ) {
    return this.onboardingService.createTemplate(orgId, dto);
  }

  @Get('processes')
  @ApiOperation({ summary: 'List active onboarding processes and progress' })
  async getProcesses(@GetUser('organizationId') orgId: string) {
    return this.onboardingService.getProcesses(orgId);
  }

  @Post('assign')
  @ApiOperation({ summary: 'Assign onboarding checklist to a new hire' })
  async assignOnboarding(@GetUser('organizationId') orgId: string, @Body() dto: AssignOnboardingDto) {
    return this.onboardingService.assignOnboarding(orgId, dto);
  }

  @Patch('tasks/:id')
  @ApiOperation({ summary: 'Update onboarding task status and recalculate progress percentage' })
  async updateTaskStatus(
    @GetUser('organizationId') orgId: string,
    @Param('id') taskId: string,
    @Body() dto: UpdateTaskStatusDto,
  ) {
    return this.onboardingService.updateTaskStatus(orgId, taskId, dto);
  }
}
