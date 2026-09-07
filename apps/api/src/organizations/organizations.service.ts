import { Injectable, NotFoundException, ForbiddenException, ConflictException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
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

@Injectable()
export class OrganizationsService {
  constructor(private readonly prisma: PrismaService) {}

  async getOrganization(organizationId: string) {
    const org = await this.prisma.organization.findUnique({
      where: { id: organizationId },
    });
    if (!org) throw new NotFoundException('Organization not found');
    return org;
  }

  async updateOrganization(organizationId: string, dto: UpdateOrganizationDto) {
    return this.prisma.organization.update({
      where: { id: organizationId },
      data: dto,
    });
  }

  // Branch CRUD
  async getBranches(organizationId: string) {
    return this.prisma.branch.findMany({
      where: { organizationId },
      orderBy: { name: 'asc' },
    });
  }

  async createBranch(organizationId: string, dto: CreateBranchDto) {
    const existing = await this.prisma.branch.findUnique({
      where: { organizationId_code: { organizationId, code: dto.code } },
    });
    if (existing) throw new ConflictException('Branch code already exists');

    return this.prisma.branch.create({
      data: { ...dto, organizationId },
    });
  }

  async deleteBranch(organizationId: string, branchId: string) {
    const branch = await this.prisma.branch.findFirst({
      where: { id: branchId, organizationId },
    });
    if (!branch) throw new ForbiddenException('Branch not found or cross-tenant access denied');
    return this.prisma.branch.delete({ where: { id: branchId } });
  }

  // Department CRUD & Hierarchy
  async getDepartments(organizationId: string) {
    return this.prisma.department.findMany({
      where: { organizationId },
      include: {
        parentDepartment: true,
        subDepartments: true,
        jobPositions: true,
      },
      orderBy: { name: 'asc' },
    });
  }

  async createDepartment(organizationId: string, dto: CreateDepartmentDto) {
    const existing = await this.prisma.department.findUnique({
      where: { organizationId_code: { organizationId, code: dto.code } },
    });
    if (existing) throw new ConflictException('Department code already exists');

    return this.prisma.department.create({
      data: { ...dto, organizationId },
    });
  }

  async deleteDepartment(organizationId: string, departmentId: string) {
    const department = await this.prisma.department.findFirst({
      where: { id: departmentId, organizationId },
    });
    if (!department) throw new ForbiddenException('Department not found or cross-tenant access denied');
    return this.prisma.department.delete({ where: { id: departmentId } });
  }

  // Team CRUD
  async getTeams(organizationId: string) {
    return this.prisma.team.findMany({
      where: { organizationId },
      include: { department: true },
      orderBy: { name: 'asc' },
    });
  }

  async createTeam(organizationId: string, dto: CreateTeamDto) {
    const dept = await this.prisma.department.findFirst({
      where: { id: dto.departmentId, organizationId },
    });
    if (!dept) throw new ForbiddenException('Department not found or cross-tenant access denied');

    return this.prisma.team.create({
      data: { ...dto, organizationId },
    });
  }

  // Location CRUD
  async getLocations(organizationId: string) {
    return this.prisma.location.findMany({
      where: { organizationId },
      orderBy: { name: 'asc' },
    });
  }

  async createLocation(organizationId: string, dto: CreateLocationDto) {
    return this.prisma.location.create({
      data: { ...dto, organizationId },
    });
  }

  // Job Grades & Positions
  async getJobGrades(organizationId: string) {
    return this.prisma.jobGrade.findMany({
      where: { organizationId },
      orderBy: { level: 'asc' },
    });
  }

  async createJobGrade(organizationId: string, dto: CreateJobGradeDto) {
    return this.prisma.jobGrade.create({
      data: { ...dto, organizationId },
    });
  }

  async getJobPositions(organizationId: string) {
    return this.prisma.jobPosition.findMany({
      where: { organizationId },
      include: { department: true, jobGrade: true },
      orderBy: { title: 'asc' },
    });
  }

  async createJobPosition(organizationId: string, dto: CreateJobPositionDto) {
    return this.prisma.jobPosition.create({
      data: { ...dto, organizationId },
    });
  }

  // Employment Types
  async getEmploymentTypes(organizationId: string) {
    return this.prisma.employmentType.findMany({
      where: { organizationId },
    });
  }

  async createEmploymentType(organizationId: string, dto: CreateEmploymentTypeDto) {
    return this.prisma.employmentType.create({
      data: { ...dto, organizationId },
    });
  }

  // Schedules & Holidays
  async getSchedules(organizationId: string) {
    return this.prisma.workSchedule.findMany({
      where: { organizationId },
    });
  }

  async createSchedule(organizationId: string, dto: CreateWorkScheduleDto) {
    return this.prisma.workSchedule.create({
      data: { ...dto, organizationId },
    });
  }

  async getHolidays(organizationId: string) {
    return this.prisma.holidayCalendar.findMany({
      where: { organizationId },
      orderBy: { date: 'asc' },
    });
  }

  async createHoliday(organizationId: string, dto: CreateHolidayDto) {
    return this.prisma.holidayCalendar.create({
      data: {
        name: dto.name,
        date: new Date(dto.date),
        isRecurring: dto.isRecurring ?? true,
        organizationId,
      },
    });
  }
}
