import { Controller, Get, Post, Patch, Body, Param, UseGuards, Request, ForbiddenException } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { ComplianceService } from './compliance.service';
import { CreatePolicyDto, AcknowledgePolicyDto, ReportIncidentDto, UpdateIncidentStatusDto } from './dto/compliance.dto';

@Controller('compliance')
@UseGuards(JwtAuthGuard)
export class ComplianceController {
  constructor(private readonly complianceService: ComplianceService) {}

  @Post('policies')
  async createPolicy(@Request() req: any, @Body() dto: CreatePolicyDto) {
    const tenantId = req.user.organizationId;
    return this.complianceService.createPolicy(tenantId, dto);
  }

  @Post('policies/acknowledge')
  async acknowledgePolicy(@Request() req: any, @Body() dto: AcknowledgePolicyDto) {
    const tenantId = req.user.organizationId;
    const employeeId = req.user.employeeId;
    if (!employeeId) {
      throw new ForbiddenException('User is not linked to an employee record');
    }
    return this.complianceService.acknowledgePolicy(tenantId, employeeId, dto);
  }

  @Post('incidents')
  async reportIncident(@Request() req: any, @Body() dto: ReportIncidentDto) {
    const tenantId = req.user.organizationId;
    const employeeId = req.user.employeeId;
    if (!employeeId) {
      throw new ForbiddenException('User is not linked to an employee record');
    }
    return this.complianceService.reportIncident(tenantId, employeeId, dto);
  }

  @Get('policies')
  async findAllPolicies(@Request() req: any) {
    const tenantId = req.user.organizationId;
    return this.complianceService.findAllPolicies(tenantId);
  }

  @Get('incidents')
  async findAllIncidents(@Request() req: any) {
    const tenantId = req.user.organizationId;
    return this.complianceService.findAllIncidents(tenantId);
  }

  @Patch('incidents/:id/status')
  async updateIncidentStatus(
    @Request() req: any,
    @Param('id') id: string,
    @Body() dto: UpdateIncidentStatusDto,
  ) {
    const tenantId = req.user.organizationId;
    return this.complianceService.updateIncidentStatus(tenantId, id, dto);
  }
}
