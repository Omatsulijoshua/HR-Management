import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import {
  CreateGoalDto,
  UpdateKeyResultProgressDto,
  CreateReviewCycleDto,
  SubmitSelfEvaluationDto,
  SubmitManagerEvaluationDto,
  Submit360FeedbackDto,
} from './dto/performance.dto';
import { GoalStatus, EvaluationStatus, ReviewCycleStatus } from '@prisma/client';

@Injectable()
export class PerformanceService {
  constructor(private readonly prisma: PrismaService) {}

  // 1. OKRs & Goal Tracking
  async createGoal(organizationId: string, dto: CreateGoalDto) {
    return this.prisma.goal.create({
      data: {
        organizationId,
        employeeId: dto.employeeId || null,
        title: dto.title,
        description: dto.description,
        category: dto.category,
        status: GoalStatus.NOT_STARTED,
        startDate: new Date(dto.startDate),
        targetDate: new Date(dto.targetDate),
        keyResults: {
          create: dto.keyResults.map((kr) => ({
            title: kr.title,
            initialValue: kr.initialValue ?? 0,
            currentValue: kr.initialValue ?? 0,
            targetValue: kr.targetValue,
            unit: kr.unit ?? '%',
          })),
        },
      },
      include: {
        keyResults: true,
        employee: true,
      },
    });
  }

  async updateKeyResultProgress(organizationId: string, keyResultId: string, dto: UpdateKeyResultProgressDto) {
    const kr = await this.prisma.goalKeyResult.findUnique({
      where: { id: keyResultId },
      include: { goal: true },
    });

    if (!kr || kr.goal.organizationId !== organizationId) {
      throw new NotFoundException('Key Result record not found');
    }

    await this.prisma.goalKeyResult.update({
      where: { id: keyResultId },
      data: { currentValue: dto.currentValue },
    });

    // Recalculate goal progress
    const allKrs = await this.prisma.goalKeyResult.findMany({
      where: { goalId: kr.goalId },
    });

    let totalPct = 0;
    for (const item of allKrs) {
      const current = item.id === keyResultId ? dto.currentValue : item.currentValue;
      const range = item.targetValue - item.initialValue;
      const pct = range > 0 ? Math.min(100, Math.max(0, ((current - item.initialValue) / range) * 100)) : 100;
      totalPct += pct;
    }

    const overallProgress = allKrs.length > 0 ? totalPct / allKrs.length : 0;
    let goalStatus: GoalStatus = GoalStatus.IN_PROGRESS;
    if (overallProgress >= 100) {
      goalStatus = GoalStatus.COMPLETED;
    } else if (overallProgress >= 70) {
      goalStatus = GoalStatus.ON_TRACK;
    }

    return this.prisma.goal.update({
      where: { id: kr.goalId },
      data: {
        progressPercentage: overallProgress,
        status: goalStatus,
      },
      include: { keyResults: true },
    });
  }

  async getGoals(organizationId: string, employeeId?: string) {
    return this.prisma.goal.findMany({
      where: {
        organizationId,
        ...(employeeId ? { employeeId } : {}),
      },
      include: { keyResults: true, employee: true },
      orderBy: { createdAt: 'desc' },
    });
  }

  // 2. Performance Review Cycles & Evaluations
  async createReviewCycle(organizationId: string, dto: CreateReviewCycleDto) {
    return this.prisma.performanceReviewCycle.create({
      data: {
        organizationId,
        title: dto.title,
        startDate: new Date(dto.startDate),
        endDate: new Date(dto.endDate),
        status: ReviewCycleStatus.ACTIVE,
      },
    });
  }

  async getReviewCycles(organizationId: string) {
    return this.prisma.performanceReviewCycle.findMany({
      where: { organizationId },
      include: { reviews: true },
      orderBy: { createdAt: 'desc' },
    });
  }

  async createPerformanceReview(organizationId: string, cycleId: string, employeeId: string, reviewerId?: string) {
    return this.prisma.performanceReview.create({
      data: {
        organizationId,
        cycleId,
        employeeId,
        reviewerId: reviewerId || null,
        status: EvaluationStatus.SELF_EVALUATION_PENDING,
      },
      include: {
        employee: true,
        reviewer: true,
        cycle: true,
      },
    });
  }

  async submitSelfEvaluation(organizationId: string, reviewId: string, dto: SubmitSelfEvaluationDto) {
    const review = await this.prisma.performanceReview.findFirst({
      where: { id: reviewId, organizationId },
    });

    if (!review) {
      throw new NotFoundException('Performance review not found');
    }

    return this.prisma.performanceReview.update({
      where: { id: reviewId },
      data: {
        selfRating: dto.selfRating,
        selfFeedback: dto.selfFeedback,
        status: EvaluationStatus.MANAGER_EVALUATION_PENDING,
      },
    });
  }

  async submitManagerEvaluation(organizationId: string, reviewId: string, dto: SubmitManagerEvaluationDto) {
    const review = await this.prisma.performanceReview.findFirst({
      where: { id: reviewId, organizationId },
    });

    if (!review) {
      throw new NotFoundException('Performance review not found');
    }

    const selfRating = review.selfRating || dto.managerRating;
    const finalRating = Number(((selfRating * 0.4) + (dto.managerRating * 0.6)).toFixed(1));

    return this.prisma.performanceReview.update({
      where: { id: reviewId },
      data: {
        managerRating: dto.managerRating,
        managerFeedback: dto.managerFeedback,
        finalRating,
        status: EvaluationStatus.COMPLETED,
      },
      include: {
        employee: true,
        reviewer: true,
        feedback360: true,
      },
    });
  }

  async submit360Feedback(organizationId: string, dto: Submit360FeedbackDto) {
    const review = await this.prisma.performanceReview.findFirst({
      where: { id: dto.performanceReviewId, organizationId },
    });

    if (!review) {
      throw new NotFoundException('Performance review not found');
    }

    return this.prisma.feedback360.create({
      data: {
        performanceReviewId: dto.performanceReviewId,
        peerName: dto.peerName,
        peerRole: dto.peerRole,
        rating: dto.rating,
        comments: dto.comments,
      },
    });
  }

  async getPerformanceReviews(organizationId: string) {
    return this.prisma.performanceReview.findMany({
      where: { organizationId },
      include: {
        employee: true,
        reviewer: true,
        cycle: true,
        feedback360: true,
      },
      orderBy: { createdAt: 'desc' },
    });
  }
}
