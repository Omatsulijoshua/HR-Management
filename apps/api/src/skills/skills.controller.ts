import { Controller, Get, Post, Body, Param, UseGuards, Req } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { TenantGuard } from '../organizations/guards/tenant.guard';
import { SkillsService } from './skills.service';
import {
  CreateSkillDto,
  RateEmployeeSkillDto,
  CreateSkillRequirementDto,
} from './dto/skills.dto';

@ApiTags('Skills Inventory & Gap Analysis')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, TenantGuard)
@Controller('skills')
export class SkillsController {
  constructor(private readonly skillsService: SkillsService) {}

  @Post()
  @ApiOperation({ summary: 'Create a skill definition in taxonomy' })
  async createSkill(@Req() req: any, @Body() dto: CreateSkillDto) {
    return this.skillsService.createSkill(req.user.organizationId, dto);
  }

  @Get()
  @ApiOperation({ summary: 'Get organization skill taxonomy' })
  async getSkills(@Req() req: any) {
    return this.skillsService.getSkills(req.user.organizationId);
  }

  @Post('employee-skills')
  @ApiOperation({ summary: 'Rate employee skill proficiency score' })
  async rateEmployeeSkill(@Req() req: any, @Body() dto: RateEmployeeSkillDto) {
    return this.skillsService.rateEmployeeSkill(req.user.organizationId, dto);
  }

  @Post('requirements')
  @ApiOperation({ summary: 'Add required skill level for a job position' })
  async addSkillRequirement(@Req() req: any, @Body() dto: CreateSkillRequirementDto) {
    return this.skillsService.addSkillRequirement(req.user.organizationId, dto);
  }

  @Get('gap-analysis/:employeeId')
  @ApiOperation({ summary: 'Get employee skill gap analysis against job requirements' })
  async getSkillGapAnalysis(@Req() req: any, @Param('employeeId') employeeId: string) {
    return this.skillsService.getSkillGapAnalysis(req.user.organizationId, employeeId);
  }
}
