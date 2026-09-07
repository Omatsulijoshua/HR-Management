import { Controller, Get, Patch, Body, UseGuards, Request, ForbiddenException } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { EssService } from './ess.service';
import { UpdateProfileDto } from './dto/ess.dto';

@Controller('ess')
@UseGuards(JwtAuthGuard)
export class EssController {
  constructor(private readonly essService: EssService) {}

  @Get('profile')
  async getMyProfile(@Request() req: any) {
    const tenantId = req.user.organizationId;
    const employeeId = req.user.employeeId;
    if (!employeeId) {
      throw new ForbiddenException('User is not linked to an employee record');
    }
    return this.essService.getMyProfile(tenantId, employeeId);
  }

  @Patch('profile')
  async updateMyProfile(@Request() req: any, @Body() dto: UpdateProfileDto) {
    const tenantId = req.user.organizationId;
    const employeeId = req.user.employeeId;
    if (!employeeId) {
      throw new ForbiddenException('User is not linked to an employee record');
    }
    return this.essService.updateMyProfile(tenantId, employeeId, dto);
  }

  @Get('overview')
  async getMyOverviewSummary(@Request() req: any) {
    const tenantId = req.user.organizationId;
    const employeeId = req.user.employeeId;
    if (!employeeId) {
      throw new ForbiddenException('User is not linked to an employee record');
    }
    return this.essService.getMyOverviewSummary(tenantId, employeeId);
  }
}
