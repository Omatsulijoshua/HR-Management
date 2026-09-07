import { Controller, Get, Post, Body, UseGuards, Request, ForbiddenException } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { MssService } from './mss.service';
import { CreateDelegationDto, ScheduleOneOnOneDto } from './dto/mss.dto';

@Controller('mss')
@UseGuards(JwtAuthGuard)
export class MssController {
  constructor(private readonly mssService: MssService) {}

  @Get('team')
  async getMyTeam(@Request() req: any) {
    const tenantId = req.user.organizationId;
    const managerId = req.user.employeeId;
    if (!managerId) {
      throw new ForbiddenException('User is not linked to an employee record');
    }
    return this.mssService.getMyTeam(tenantId, managerId);
  }

  @Get('dashboard')
  async getManagerDashboardSummary(@Request() req: any) {
    const tenantId = req.user.organizationId;
    const managerId = req.user.employeeId;
    if (!managerId) {
      throw new ForbiddenException('User is not linked to an employee record');
    }
    return this.mssService.getManagerDashboardSummary(tenantId, managerId);
  }

  @Post('delegations')
  async createDelegation(@Request() req: any, @Body() dto: CreateDelegationDto) {
    const tenantId = req.user.organizationId;
    const managerId = req.user.employeeId;
    if (!managerId) {
      throw new ForbiddenException('User is not linked to an employee record');
    }
    return this.mssService.createDelegation(tenantId, managerId, dto);
  }

  @Post('one-on-one')
  async scheduleOneOnOne(@Request() req: any, @Body() dto: ScheduleOneOnOneDto) {
    const tenantId = req.user.organizationId;
    const managerId = req.user.employeeId;
    if (!managerId) {
      throw new ForbiddenException('User is not linked to an employee record');
    }
    return this.mssService.scheduleOneOnOne(tenantId, managerId, dto);
  }
}
