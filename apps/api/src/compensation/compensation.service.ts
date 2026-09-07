import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import {
  CreateCompensationReviewDto,
  UpdateCompensationReviewStatusDto,
  AllocateBonusDto,
} from './dto/compensation.dto';
import { CompensationReviewStatus } from '@prisma/client';

@Injectable()
export class CompensationService {
  constructor(private readonly prisma: PrismaService) {}

  async createCompensationReview(organizationId: string, dto: CreateCompensationReviewDto) {
    const employee = await this.prisma.employee.findFirst({
      where: { id: dto.employeeId, organizationId },
    });

    if (!employee) {
      throw new NotFoundException('Employee not found in this organization');
    }

    const percentageIncrease = dto.currentSalary > 0
      ? ((dto.proposedSalary - dto.currentSalary) / dto.currentSalary) * 100
      : 0;

    return this.prisma.compensationReview.create({
      data: {
        organizationId,
        employeeId: dto.employeeId,
        reviewTitle: dto.reviewTitle,
        currentSalary: dto.currentSalary,
        proposedSalary: dto.proposedSalary,
        percentageIncrease,
        reason: dto.reason,
        status: CompensationReviewStatus.SUBMITTED,
        effectiveDate: new Date(dto.effectiveDate),
      },
      include: { employee: true },
    });
  }

  async updateCompensationReviewStatus(organizationId: string, reviewId: string, dto: UpdateCompensationReviewStatusDto) {
    const review = await this.prisma.compensationReview.findFirst({
      where: { id: reviewId, organizationId },
    });

    if (!review) {
      throw new NotFoundException('Compensation review record not found');
    }

    return this.prisma.$transaction(async (tx) => {
      const updated = await tx.compensationReview.update({
        where: { id: reviewId },
        data: { status: dto.status },
        include: { employee: true },
      });

      // If approved, update employee basic salary and log history
      if (dto.status === CompensationReviewStatus.APPROVED) {
        await tx.employee.update({
          where: { id: review.employeeId },
          data: { basicSalary: review.proposedSalary },
        });

        await tx.employeeHistory.create({
          data: {
            organizationId,
            employeeId: review.employeeId,
            eventType: 'COMPENSATION_ADJUSTMENT',
            description: `Salary adjusted from ${review.currentSalary} to ${review.proposedSalary} (${review.percentageIncrease.toFixed(1)}% increase)`,
            previousData: { salary: review.currentSalary },
            newData: { salary: review.proposedSalary },
            effectiveDate: review.effectiveDate,
          },
        });
      }

      return updated;
    });
  }

  async getCompensationReviews(organizationId: string) {
    return this.prisma.compensationReview.findMany({
      where: { organizationId },
      include: { employee: true },
      orderBy: { createdAt: 'desc' },
    });
  }

  async allocateBonus(organizationId: string, dto: AllocateBonusDto) {
    const employee = await this.prisma.employee.findFirst({
      where: { id: dto.employeeId, organizationId },
    });

    if (!employee) {
      throw new NotFoundException('Employee not found');
    }

    return this.prisma.bonusAllocation.create({
      data: {
        organizationId,
        employeeId: dto.employeeId,
        bonusTitle: dto.bonusTitle,
        amount: dto.amount,
        reason: dto.reason,
      },
      include: { employee: true },
    });
  }

  async getBonusAllocations(organizationId: string) {
    return this.prisma.bonusAllocation.findMany({
      where: { organizationId },
      include: { employee: true },
      orderBy: { createdAt: 'desc' },
    });
  }
}
