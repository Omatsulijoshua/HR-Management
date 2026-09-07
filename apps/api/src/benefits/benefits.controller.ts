import { Controller, Get, Post, Patch, Body, Param, UseGuards, Req } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { TenantGuard } from '../organizations/guards/tenant.guard';
import { BenefitsService } from './benefits.service';
import {
  CreateBenefitPlanDto,
  EnrollEmployeeBenefitDto,
  UpdateEnrollmentStatusDto,
} from './dto/benefits.dto';

@ApiTags('Benefits')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, TenantGuard)
@Controller('benefits')
export class BenefitsController {
  constructor(private readonly benefitsService: BenefitsService) {}

  @Post('plans')
  @ApiOperation({ summary: 'Create a benefit plan' })
  async createBenefitPlan(@Req() req: any, @Body() dto: CreateBenefitPlanDto) {
    return this.benefitsService.createBenefitPlan(req.user.organizationId, dto);
  }

  @Get('plans')
  @ApiOperation({ summary: 'Get all organization benefit plans' })
  async getBenefitPlans(@Req() req: any) {
    return this.benefitsService.getBenefitPlans(req.user.organizationId);
  }

  @Post('enrollments')
  @ApiOperation({ summary: 'Enroll employee in a benefit option' })
  async enrollEmployee(@Req() req: any, @Body() dto: EnrollEmployeeBenefitDto) {
    return this.benefitsService.enrollEmployee(req.user.organizationId, dto);
  }

  @Get('enrollments')
  @ApiOperation({ summary: 'Get all employee benefit enrollments' })
  async getAllEnrollments(@Req() req: any) {
    return this.benefitsService.getAllEnrollments(req.user.organizationId);
  }

  @Patch('enrollments/:id/status')
  @ApiOperation({ summary: 'Approve or reject employee benefit enrollment' })
  async updateEnrollmentStatus(@Req() req: any, @Param('id') id: string, @Body() dto: UpdateEnrollmentStatusDto) {
    return this.benefitsService.updateEnrollmentStatus(req.user.organizationId, id, dto);
  }

  @Get('my-enrollments')
  @ApiOperation({ summary: 'Get logged in employee benefit enrollments' })
  async getEmployeeEnrollments(@Req() req: any) {
    const employeeId = req.user.employeeId || req.user.id;
    return this.benefitsService.getEmployeeEnrollments(req.user.organizationId, employeeId);
  }
}
