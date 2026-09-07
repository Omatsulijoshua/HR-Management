import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import {
  CreateBenefitPlanDto,
  EnrollEmployeeBenefitDto,
  UpdateEnrollmentStatusDto,
} from './dto/benefits.dto';

@Injectable()
export class BenefitsService {
  constructor(private readonly prisma: PrismaService) {}

  async createBenefitPlan(organizationId: string, dto: CreateBenefitPlanDto) {
    const existing = await this.prisma.benefitPlan.findUnique({
      where: {
        organizationId_code: {
          organizationId,
          code: dto.code,
        },
      },
    });

    if (existing) {
      throw new ConflictException(`Benefit plan with code ${dto.code} already exists`);
    }

    return this.prisma.benefitPlan.create({
      data: {
        organizationId,
        name: dto.name,
        code: dto.code,
        type: dto.type,
        provider: dto.provider,
        description: dto.description,
        options: {
          create: dto.options.map((opt) => ({
            name: opt.name,
            coverageTier: opt.coverageTier,
            employeeContribution: opt.employeeContribution ?? 0,
            employerContribution: opt.employerContribution ?? 0,
          })),
        },
      },
      include: {
        options: true,
      },
    });
  }

  async getBenefitPlans(organizationId: string) {
    return this.prisma.benefitPlan.findMany({
      where: { organizationId },
      include: { options: true },
      orderBy: { createdAt: 'desc' },
    });
  }

  async enrollEmployee(organizationId: string, dto: EnrollEmployeeBenefitDto) {
    const employee = await this.prisma.employee.findFirst({
      where: { id: dto.employeeId, organizationId },
    });

    if (!employee) {
      throw new NotFoundException('Employee not found');
    }

    const plan = await this.prisma.benefitPlan.findFirst({
      where: { id: dto.benefitPlanId, organizationId },
    });

    if (!plan) {
      throw new NotFoundException('Benefit plan not found');
    }

    const option = await this.prisma.benefitOption.findFirst({
      where: { id: dto.benefitOptionId, benefitPlanId: dto.benefitPlanId },
    });

    if (!option) {
      throw new NotFoundException('Benefit tier option not found');
    }

    return this.prisma.employeeBenefitEnrollment.create({
      data: {
        organizationId,
        employeeId: dto.employeeId,
        benefitPlanId: dto.benefitPlanId,
        benefitOptionId: dto.benefitOptionId,
        status: 'PENDING',
        effectiveFrom: new Date(dto.effectiveFrom),
        effectiveTo: dto.effectiveTo ? new Date(dto.effectiveTo) : null,
      },
      include: {
        benefitPlan: true,
        benefitOption: true,
        employee: true,
      },
    });
  }

  async updateEnrollmentStatus(organizationId: string, enrollmentId: string, dto: UpdateEnrollmentStatusDto) {
    const enrollment = await this.prisma.employeeBenefitEnrollment.findFirst({
      where: { id: enrollmentId, organizationId },
    });

    if (!enrollment) {
      throw new NotFoundException('Enrollment record not found');
    }

    return this.prisma.employeeBenefitEnrollment.update({
      where: { id: enrollmentId },
      data: { status: dto.status },
      include: {
        benefitPlan: true,
        benefitOption: true,
        employee: true,
      },
    });
  }

  async getEmployeeEnrollments(organizationId: string, employeeId: string) {
    return this.prisma.employeeBenefitEnrollment.findMany({
      where: { organizationId, employeeId },
      include: {
        benefitPlan: true,
        benefitOption: true,
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  async getAllEnrollments(organizationId: string) {
    return this.prisma.employeeBenefitEnrollment.findMany({
      where: { organizationId },
      include: {
        benefitPlan: true,
        benefitOption: true,
        employee: true,
      },
      orderBy: { createdAt: 'desc' },
    });
  }
}
