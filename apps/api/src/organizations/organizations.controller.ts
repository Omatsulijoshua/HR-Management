import {
  Controller,
  Get,
  Post,
  Patch,
  Delete,
  Body,
  Param,
  UseGuards,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { OrganizationsService } from './organizations.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { TenantGuard } from './guards/tenant.guard';
import { GetUser } from '../auth/decorators/get-user.decorator';
import {
  UpdateOrganizationDto,
  CreateBranchDto,
  CreateDepartmentDto,
  CreateTeamDto,
  CreateLocationDto,
  CreateJobGradeDto,
  CreateJobPositionDto,
  CreateEmploymentTypeDto,
  CreateWorkScheduleDto,
  CreateHolidayDto,
} from './dto/organization.dto';

@ApiTags('Organization')
@Controller('organizations')
@UseGuards(JwtAuthGuard, TenantGuard)
@ApiBearerAuth()
export class OrganizationsController {
  constructor(private readonly organizationsService: OrganizationsService) {}

  @Get('settings')
  @ApiOperation({ summary: 'Get organization company profile & settings' })
  async getSettings(@GetUser('organizationId') orgId: string) {
    return this.organizationsService.getOrganization(orgId);
  }

  @Patch('settings')
  @ApiOperation({ summary: 'Update organization company profile & settings' })
  async updateSettings(
    @GetUser('organizationId') orgId: string,
    @Body() dto: UpdateOrganizationDto,
  ) {
    return this.organizationsService.updateOrganization(orgId, dto);
  }

  // Branches
  @Get('branches')
  @ApiOperation({ summary: 'List organization branches' })
  async getBranches(@GetUser('organizationId') orgId: string) {
    return this.organizationsService.getBranches(orgId);
  }

  @Post('branches')
  @ApiOperation({ summary: 'Create new organization branch' })
  async createBranch(@GetUser('organizationId') orgId: string, @Body() dto: CreateBranchDto) {
    return this.organizationsService.createBranch(orgId, dto);
  }

  @Delete('branches/:id')
  @ApiOperation({ summary: 'Delete organization branch' })
  async deleteBranch(@GetUser('organizationId') orgId: string, @Param('id') branchId: string) {
    return this.organizationsService.deleteBranch(orgId, branchId);
  }

  // Departments
  @Get('departments')
  @ApiOperation({ summary: 'List organization departments & hierarchy' })
  async getDepartments(@GetUser('organizationId') orgId: string) {
    return this.organizationsService.getDepartments(orgId);
  }

  @Post('departments')
  @ApiOperation({ summary: 'Create new organization department' })
  async createDepartment(
    @GetUser('organizationId') orgId: string,
    @Body() dto: CreateDepartmentDto,
  ) {
    return this.organizationsService.createDepartment(orgId, dto);
  }

  @Delete('departments/:id')
  @ApiOperation({ summary: 'Delete organization department' })
  async deleteDepartment(
    @GetUser('organizationId') orgId: string,
    @Param('id') departmentId: string,
  ) {
    return this.organizationsService.deleteDepartment(orgId, departmentId);
  }

  // Teams
  @Get('teams')
  @ApiOperation({ summary: 'List organization teams' })
  async getTeams(@GetUser('organizationId') orgId: string) {
    return this.organizationsService.getTeams(orgId);
  }

  @Post('teams')
  @ApiOperation({ summary: 'Create new department team' })
  async createTeam(@GetUser('organizationId') orgId: string, @Body() dto: CreateTeamDto) {
    return this.organizationsService.createTeam(orgId, dto);
  }

  // Locations
  @Get('locations')
  @ApiOperation({ summary: 'List office locations' })
  async getLocations(@GetUser('organizationId') orgId: string) {
    return this.organizationsService.getLocations(orgId);
  }

  @Post('locations')
  @ApiOperation({ summary: 'Create office location' })
  async createLocation(@GetUser('organizationId') orgId: string, @Body() dto: CreateLocationDto) {
    return this.organizationsService.createLocation(orgId, dto);
  }

  // Job Grades & Positions
  @Get('job-grades')
  @ApiOperation({ summary: 'List salary job grades' })
  async getJobGrades(@GetUser('organizationId') orgId: string) {
    return this.organizationsService.getJobGrades(orgId);
  }

  @Post('job-grades')
  @ApiOperation({ summary: 'Create salary job grade' })
  async createJobGrade(@GetUser('organizationId') orgId: string, @Body() dto: CreateJobGradeDto) {
    return this.organizationsService.createJobGrade(orgId, dto);
  }

  @Get('positions')
  @ApiOperation({ summary: 'List job positions' })
  async getJobPositions(@GetUser('organizationId') orgId: string) {
    return this.organizationsService.getJobPositions(orgId);
  }

  @Post('positions')
  @ApiOperation({ summary: 'Create job position' })
  async createJobPosition(
    @GetUser('organizationId') orgId: string,
    @Body() dto: CreateJobPositionDto,
  ) {
    return this.organizationsService.createJobPosition(orgId, dto);
  }

  // Employment Types
  @Get('employment-types')
  @ApiOperation({ summary: 'List employment types' })
  async getEmploymentTypes(@GetUser('organizationId') orgId: string) {
    return this.organizationsService.getEmploymentTypes(orgId);
  }

  @Post('employment-types')
  @ApiOperation({ summary: 'Create employment type' })
  async createEmploymentType(
    @GetUser('organizationId') orgId: string,
    @Body() dto: CreateEmploymentTypeDto,
  ) {
    return this.organizationsService.createEmploymentType(orgId, dto);
  }

  // Schedules & Holidays
  @Get('work-schedules')
  @ApiOperation({ summary: 'List working day schedules' })
  async getSchedules(@GetUser('organizationId') orgId: string) {
    return this.organizationsService.getSchedules(orgId);
  }

  @Post('work-schedules')
  @ApiOperation({ summary: 'Create working schedule' })
  async createSchedule(
    @GetUser('organizationId') orgId: string,
    @Body() dto: CreateWorkScheduleDto,
  ) {
    return this.organizationsService.createSchedule(orgId, dto);
  }

  @Get('holidays')
  @ApiOperation({ summary: 'List public holiday calendar' })
  async getHolidays(@GetUser('organizationId') orgId: string) {
    return this.organizationsService.getHolidays(orgId);
  }

  @Post('holidays')
  @ApiOperation({ summary: 'Create public holiday entry' })
  async createHoliday(@GetUser('organizationId') orgId: string, @Body() dto: CreateHolidayDto) {
    return this.organizationsService.createHoliday(orgId, dto);
  }
}
