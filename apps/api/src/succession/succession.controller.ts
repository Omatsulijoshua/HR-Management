import { Controller, Get, Post, Body, Param, UseGuards, Request } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { SuccessionService } from './succession.service';
import { CreateSuccessionPlanDto, AddSuccessionCandidateDto } from './dto/succession.dto';

@Controller('succession')
@UseGuards(JwtAuthGuard)
export class SuccessionController {
  constructor(private readonly successionService: SuccessionService) {}

  @Post('plans')
  async createSuccessionPlan(@Request() req: any, @Body() dto: CreateSuccessionPlanDto) {
    const tenantId = req.user.organizationId;
    return this.successionService.createSuccessionPlan(tenantId, dto);
  }

  @Post('candidates')
  async addCandidate(@Request() req: any, @Body() dto: AddSuccessionCandidateDto) {
    const tenantId = req.user.organizationId;
    return this.successionService.addCandidate(tenantId, dto);
  }

  @Get('plans')
  async findAllPlans(@Request() req: any) {
    const tenantId = req.user.organizationId;
    return this.successionService.findAllPlans(tenantId);
  }

  @Get('plans/:id')
  async findOnePlan(@Request() req: any, @Param('id') id: string) {
    const tenantId = req.user.organizationId;
    return this.successionService.findOnePlan(tenantId, id);
  }
}
