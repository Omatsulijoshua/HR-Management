import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateSuccessionPlanDto, AddSuccessionCandidateDto } from './dto/succession.dto';

@Injectable()
export class SuccessionService {
  constructor(private readonly prisma: PrismaService) {}

  async createSuccessionPlan(tenantId: string, dto: CreateSuccessionPlanDto) {
    const existing = await this.prisma.successionPlan.findUnique({
      where: {
        organizationId_jobPositionId: {
          organizationId: tenantId,
          jobPositionId: dto.jobPositionId,
        },
      },
    });

    if (existing) {
      throw new ConflictException(`Succession plan for position '${dto.jobPositionId}' already exists`);
    }

    return this.prisma.successionPlan.create({
      data: {
        organizationId: tenantId,
        jobPositionId: dto.jobPositionId,
        riskOfLoss: dto.riskOfLoss ?? 'MEDIUM',
        impactOfLoss: dto.impactOfLoss ?? 'HIGH',
        notes: dto.notes,
      },
      include: {
        jobPosition: true,
        candidates: {
          include: {
            candidate: true,
          },
        },
      },
    });
  }

  async addCandidate(tenantId: string, dto: AddSuccessionCandidateDto) {
    const plan = await this.prisma.successionPlan.findFirst({
      where: { id: dto.successionPlanId, organizationId: tenantId },
    });

    if (!plan) {
      throw new NotFoundException(`Succession plan with ID ${dto.successionPlanId} not found`);
    }

    return this.prisma.successionCandidate.create({
      data: {
        successionPlanId: dto.successionPlanId,
        candidateId: dto.candidateId,
        readinessLevel: dto.readinessLevel ?? 'READY_1_2_YEARS',
        notes: dto.notes,
      },
      include: {
        candidate: true,
      },
    });
  }

  async findAllPlans(tenantId: string) {
    return this.prisma.successionPlan.findMany({
      where: { organizationId: tenantId },
      include: {
        jobPosition: true,
        candidates: {
          include: {
            candidate: true,
          },
        },
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  async findOnePlan(tenantId: string, id: string) {
    const plan = await this.prisma.successionPlan.findFirst({
      where: { id, organizationId: tenantId },
      include: {
        jobPosition: true,
        candidates: {
          include: {
            candidate: true,
          },
        },
      },
    });

    if (!plan) {
      throw new NotFoundException(`Succession plan with ID ${id} not found`);
    }

    return plan;
  }
}
