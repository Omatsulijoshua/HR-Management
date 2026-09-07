import { Controller, Get, Post, Patch, Body, Param, Query, UseGuards, Req } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { TenantGuard } from '../organizations/guards/tenant.guard';
import { PerformanceService } from './performance.service';
import {
  CreateGoalDto,
  UpdateKeyResultProgressDto,
  CreateReviewCycleDto,
  SubmitSelfEvaluationDto,
  SubmitManagerEvaluationDto,
  Submit360FeedbackDto,
} from './dto/performance.dto';

@ApiTags('Performance & Goals')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, TenantGuard)
@Controller('performance')
export class PerformanceController {
  constructor(private readonly performanceService: PerformanceService) {}

  @Post('goals')
  @ApiOperation({ summary: 'Create OKR or KPI goal' })
  async createGoal(@Req() req: any, @Body() dto: CreateGoalDto) {
    return this.performanceService.createGoal(req.user.organizationId, dto);
  }

  @Get('goals')
  @ApiOperation({ summary: 'Get all organization goals' })
  async getGoals(@Req() req: any, @Query('employeeId') employeeId?: string) {
    return this.performanceService.getGoals(req.user.organizationId, employeeId);
  }

  @Patch('key-results/:id')
  @ApiOperation({ summary: 'Update Key Result progress and recalculate Goal %' })
  async updateKeyResultProgress(@Req() req: any, @Param('id') id: string, @Body() dto: UpdateKeyResultProgressDto) {
    return this.performanceService.updateKeyResultProgress(req.user.organizationId, id, dto);
  }

  @Post('cycles')
  @ApiOperation({ summary: 'Create a performance review cycle' })
  async createReviewCycle(@Req() req: any, @Body() dto: CreateReviewCycleDto) {
    return this.performanceService.createReviewCycle(req.user.organizationId, dto);
  }

  @Get('cycles')
  @ApiOperation({ summary: 'Get all performance review cycles' })
  async getReviewCycles(@Req() req: any) {
    return this.performanceService.getReviewCycles(req.user.organizationId);
  }

  @Post('reviews')
  @ApiOperation({ summary: 'Initiate employee performance review' })
  async createPerformanceReview(
    @Req() req: any,
    @Body() body: { cycleId: string; employeeId: string; reviewerId?: string },
  ) {
    return this.performanceService.createPerformanceReview(req.user.organizationId, body.cycleId, body.employeeId, body.reviewerId);
  }

  @Get('reviews')
  @ApiOperation({ summary: 'Get all performance reviews' })
  async getPerformanceReviews(@Req() req: any) {
    return this.performanceService.getPerformanceReviews(req.user.organizationId);
  }

  @Patch('reviews/:id/self-eval')
  @ApiOperation({ summary: 'Submit self-evaluation rating and feedback' })
  async submitSelfEvaluation(@Req() req: any, @Param('id') id: string, @Body() dto: SubmitSelfEvaluationDto) {
    return this.performanceService.submitSelfEvaluation(req.user.organizationId, id, dto);
  }

  @Patch('reviews/:id/manager-eval')
  @ApiOperation({ summary: 'Submit manager-evaluation rating and compute final score' })
  async submitManagerEvaluation(@Req() req: any, @Param('id') id: string, @Body() dto: SubmitManagerEvaluationDto) {
    return this.performanceService.submitManagerEvaluation(req.user.organizationId, id, dto);
  }

  @Post('360-feedback')
  @ApiOperation({ summary: 'Submit 360-degree peer feedback' })
  async submit360Feedback(@Req() req: any, @Body() dto: Submit360FeedbackDto) {
    return this.performanceService.submit360Feedback(req.user.organizationId, dto);
  }
}
