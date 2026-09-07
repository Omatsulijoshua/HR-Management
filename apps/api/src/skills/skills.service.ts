import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import {
  CreateSkillDto,
  RateEmployeeSkillDto,
  CreateSkillRequirementDto,
} from './dto/skills.dto';

@Injectable()
export class SkillsService {
  constructor(private readonly prisma: PrismaService) {}

  async createSkill(organizationId: string, dto: CreateSkillDto) {
    const existing = await this.prisma.skill.findUnique({
      where: {
        organizationId_code: {
          organizationId,
          code: dto.code,
        },
      },
    });

    if (existing) {
      throw new ConflictException(`Skill with code ${dto.code} already exists`);
    }

    return this.prisma.skill.create({
      data: {
        organizationId,
        name: dto.name,
        code: dto.code,
        category: dto.category ?? 'General',
        description: dto.description,
      },
    });
  }

  async getSkills(organizationId: string) {
    return this.prisma.skill.findMany({
      where: { organizationId },
      orderBy: { name: 'asc' },
    });
  }

  async rateEmployeeSkill(organizationId: string, dto: RateEmployeeSkillDto) {
    const employee = await this.prisma.employee.findFirst({
      where: { id: dto.employeeId, organizationId },
    });

    if (!employee) {
      throw new NotFoundException('Employee not found');
    }

    const skill = await this.prisma.skill.findFirst({
      where: { id: dto.skillId, organizationId },
    });

    if (!skill) {
      throw new NotFoundException('Skill definition not found');
    }

    return this.prisma.employeeSkill.upsert({
      where: {
        employeeId_skillId: {
          employeeId: dto.employeeId,
          skillId: dto.skillId,
        },
      },
      update: {
        proficiencyLevel: dto.proficiencyLevel,
        ratingScore: dto.ratingScore,
      },
      create: {
        employeeId: dto.employeeId,
        skillId: dto.skillId,
        proficiencyLevel: dto.proficiencyLevel,
        ratingScore: dto.ratingScore,
      },
      include: {
        skill: true,
        employee: true,
      },
    });
  }

  async addSkillRequirement(organizationId: string, dto: CreateSkillRequirementDto) {
    const position = await this.prisma.jobPosition.findFirst({
      where: { id: dto.jobPositionId, organizationId },
    });

    if (!position) {
      throw new NotFoundException('Job position not found');
    }

    return this.prisma.skillRequirement.create({
      data: {
        jobPositionId: dto.jobPositionId,
        skillId: dto.skillId,
        requiredProficiency: dto.requiredProficiency,
        requiredScore: dto.requiredScore ?? 4.0,
      },
      include: {
        skill: true,
        jobPosition: true,
      },
    });
  }

  async getSkillGapAnalysis(organizationId: string, employeeId: string) {
    const employee = await this.prisma.employee.findFirst({
      where: { id: employeeId, organizationId },
      include: {
        position: {
          include: {
            skillRequirements: {
              include: { skill: true },
            },
          },
        },
        skills: {
          include: { skill: true },
        },
      },
    });

    if (!employee) {
      throw new NotFoundException('Employee not found');
    }

    const requirements = employee.position?.skillRequirements || [];
    const ratedSkillsMap = new Map(employee.skills.map((s) => [s.skillId, s.ratingScore]));

    let totalRequiredScore = 0;
    let totalAcquiredScore = 0;

    const gapDetails = requirements.map((req) => {
      const acquiredScore = ratedSkillsMap.get(req.skillId) || 0;
      const gapScore = Math.max(0, req.requiredScore - acquiredScore);
      totalRequiredScore += req.requiredScore;
      totalAcquiredScore += Math.min(acquiredScore, req.requiredScore);

      return {
        skillId: req.skillId,
        skillName: req.skill.name,
        requiredScore: req.requiredScore,
        acquiredScore,
        gapScore,
        isQualified: acquiredScore >= req.requiredScore,
      };
    });

    const overallMatchPercentage = totalRequiredScore > 0 ? (totalAcquiredScore / totalRequiredScore) * 100 : 100;

    return {
      employeeId: employee.id,
      employeeName: `${employee.firstName} ${employee.lastName}`,
      positionTitle: employee.position?.title || 'Unassigned',
      overallMatchPercentage: Number(overallMatchPercentage.toFixed(1)),
      gaps: gapDetails,
    };
  }
}
