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
import { RecruitmentService } from './recruitment.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { TenantGuard } from '../organizations/guards/tenant.guard';
import { GetUser } from '../auth/decorators/get-user.decorator';
import {
  CreateJobPostingDto,
  CreateCandidateDto,
  ApplyJobDto,
  UpdateStageDto,
  ScheduleInterviewDto,
  CreateJobOfferDto,
  ConvertCandidateDto,
} from './dto/recruitment.dto';

@ApiTags('Recruitment & ATS')
@Controller('recruitment')
@UseGuards(JwtAuthGuard, TenantGuard)
@ApiBearerAuth()
export class RecruitmentController {
  constructor(private readonly recruitmentService: RecruitmentService) {}

  @Get('jobs')
  @ApiOperation({ summary: 'List job requisitions' })
  async getJobs(@GetUser('organizationId') orgId: string) {
    return this.recruitmentService.getJobs(orgId);
  }

  @Post('jobs')
  @ApiOperation({ summary: 'Create new job requisition' })
  async createJob(@GetUser('organizationId') orgId: string, @Body() dto: CreateJobPostingDto) {
    return this.recruitmentService.createJob(orgId, dto);
  }

  @Get('candidates')
  @ApiOperation({ summary: 'List candidates in talent pool' })
  async getCandidates(@GetUser('organizationId') orgId: string) {
    return this.recruitmentService.getCandidates(orgId);
  }

  @Post('candidates')
  @ApiOperation({ summary: 'Add candidate to talent pool' })
  async createCandidate(@GetUser('organizationId') orgId: string, @Body() dto: CreateCandidateDto) {
    return this.recruitmentService.createCandidate(orgId, dto);
  }

  @Get('applications')
  @ApiOperation({ summary: 'List job applications across pipeline stages' })
  async getApplications(@GetUser('organizationId') orgId: string) {
    return this.recruitmentService.getApplications(orgId);
  }

  @Post('applications')
  @ApiOperation({ summary: 'Submit candidate job application' })
  async applyJob(@GetUser('organizationId') orgId: string, @Body() dto: ApplyJobDto) {
    return this.recruitmentService.applyJob(orgId, dto);
  }

  @Patch('applications/:id/stage')
  @ApiOperation({ summary: 'Move candidate application across pipeline stages' })
  async updateStage(
    @GetUser('organizationId') orgId: string,
    @Param('id') applicationId: string,
    @Body() dto: UpdateStageDto,
  ) {
    return this.recruitmentService.updateApplicationStage(orgId, applicationId, dto);
  }

  @Post('interviews')
  @ApiOperation({ summary: 'Schedule candidate interview' })
  async scheduleInterview(
    @GetUser('organizationId') orgId: string,
    @Body() dto: ScheduleInterviewDto,
  ) {
    return this.recruitmentService.scheduleInterview(orgId, dto);
  }

  @Post('offers')
  @ApiOperation({ summary: 'Issue job offer' })
  async createOffer(@GetUser('organizationId') orgId: string, @Body() dto: CreateJobOfferDto) {
    return this.recruitmentService.createOffer(orgId, dto);
  }

  @Post('candidates/:id/convert')
  @ApiOperation({ summary: '1-Click convert hired candidate into active Employee' })
  async convertCandidate(
    @GetUser('organizationId') orgId: string,
    @GetUser('id') currentUserId: string,
    @Param('id') candidateId: string,
    @Body() dto: ConvertCandidateDto,
  ) {
    return this.recruitmentService.convertCandidateToEmployee(orgId, candidateId, dto, currentUserId);
  }
}
