import { Test, TestingModule } from '@nestjs/testing';
import { PerformanceService } from './performance.service';
import { PrismaService } from '../prisma/prisma.service';
import { GoalStatus, GoalCategory, EvaluationStatus } from '@prisma/client';

describe('PerformanceService', () => {
  let service: PerformanceService;
  let prisma: PrismaService;

  const mockOrgId = 'org-uuid-1';
  const mockEmployeeId = 'emp-uuid-1';

  const mockPrismaService = {
    goal: {
      create: jest.fn(),
      findMany: jest.fn(),
      update: jest.fn(),
    },
    goalKeyResult: {
      findUnique: jest.fn(),
      update: jest.fn(),
      findMany: jest.fn(),
    },
    performanceReviewCycle: {
      create: jest.fn(),
      findMany: jest.fn(),
    },
    performanceReview: {
      create: jest.fn(),
      findFirst: jest.fn(),
      update: jest.fn(),
      findMany: jest.fn(),
    },
    feedback360: {
      create: jest.fn(),
    },
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        PerformanceService,
        {
          provide: PrismaService,
          useValue: mockPrismaService,
        },
      ],
    }).compile();

    service = module.get<PerformanceService>(PerformanceService);
    prisma = module.get<PrismaService>(PrismaService);
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('createGoal', () => {
    it('should create an OKR goal with key results', async () => {
      mockPrismaService.goal.create.mockResolvedValue({
        id: 'goal-1',
        organizationId: mockOrgId,
        title: 'Increase Monthly Active Tenants',
        category: GoalCategory.ORGANIZATIONAL,
        progressPercentage: 0,
        keyResults: [
          { id: 'kr-1', title: 'Onboard 50 new enterprise clients', initialValue: 0, currentValue: 0, targetValue: 50 },
        ],
      });

      const res = await service.createGoal(mockOrgId, {
        title: 'Increase Monthly Active Tenants',
        category: GoalCategory.ORGANIZATIONAL,
        startDate: '2026-09-01',
        targetDate: '2026-12-31',
        keyResults: [
          { title: 'Onboard 50 new enterprise clients', targetValue: 50 },
        ],
      });

      expect(res.title).toBe('Increase Monthly Active Tenants');
      expect(mockPrismaService.goal.create).toHaveBeenCalled();
    });
  });

  describe('updateKeyResultProgress', () => {
    it('should update key result value and recalculate goal completion percentage', async () => {
      mockPrismaService.goalKeyResult.findUnique.mockResolvedValue({
        id: 'kr-1',
        goalId: 'goal-1',
        initialValue: 0,
        currentValue: 10,
        targetValue: 50,
        goal: { id: 'goal-1', organizationId: mockOrgId },
      });

      mockPrismaService.goalKeyResult.update.mockResolvedValue({ id: 'kr-1', currentValue: 25 });
      mockPrismaService.goalKeyResult.findMany.mockResolvedValue([
        { id: 'kr-1', initialValue: 0, currentValue: 25, targetValue: 50 },
      ]);

      mockPrismaService.goal.update.mockResolvedValue({
        id: 'goal-1',
        progressPercentage: 50,
        status: GoalStatus.IN_PROGRESS,
      });

      const res = await service.updateKeyResultProgress(mockOrgId, 'kr-1', { currentValue: 25 });

      expect(res.progressPercentage).toBe(50);
      expect(mockPrismaService.goal.update).toHaveBeenCalled();
    });
  });

  describe('submitManagerEvaluation', () => {
    it('should calculate weighted final rating (40% self + 60% manager)', async () => {
      mockPrismaService.performanceReview.findFirst.mockResolvedValue({
        id: 'review-1',
        organizationId: mockOrgId,
        selfRating: 4.0,
      });

      mockPrismaService.performanceReview.update.mockResolvedValue({
        id: 'review-1',
        selfRating: 4.0,
        managerRating: 5.0,
        finalRating: 4.6, // (4.0 * 0.4) + (5.0 * 0.6) = 1.6 + 3.0 = 4.6
        status: EvaluationStatus.COMPLETED,
      });

      const res = await service.submitManagerEvaluation(mockOrgId, 'review-1', {
        managerRating: 5.0,
        managerFeedback: 'Exceeded all key objectives',
      });

      expect(res.finalRating).toBe(4.6);
      expect(res.status).toBe(EvaluationStatus.COMPLETED);
    });
  });
});
