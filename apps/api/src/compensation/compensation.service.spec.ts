import { Test, TestingModule } from '@nestjs/testing';
import { CompensationService } from './compensation.service';
import { PrismaService } from '../prisma/prisma.service';
import { CompensationReviewStatus } from '@prisma/client';

describe('CompensationService', () => {
  let service: CompensationService;
  let prisma: PrismaService;

  const mockOrgId = 'org-uuid-1';
  const mockEmployeeId = 'emp-uuid-1';

  const mockPrismaService = {
    employee: {
      findFirst: jest.fn(),
      update: jest.fn(),
    },
    compensationReview: {
      create: jest.fn(),
      findFirst: jest.fn(),
      update: jest.fn(),
      findMany: jest.fn(),
    },
    employeeHistory: {
      create: jest.fn(),
    },
    bonusAllocation: {
      create: jest.fn(),
      findMany: jest.fn(),
    },
    $transaction: jest.fn((callback) => callback(mockPrismaService)),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CompensationService,
        {
          provide: PrismaService,
          useValue: mockPrismaService,
        },
      ],
    }).compile();

    service = module.get<CompensationService>(CompensationService);
    prisma = module.get<PrismaService>(PrismaService);
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('createCompensationReview', () => {
    it('should create a salary compensation review with percentage increase', async () => {
      mockPrismaService.employee.findFirst.mockResolvedValue({ id: mockEmployeeId });
      mockPrismaService.compensationReview.create.mockResolvedValue({
        id: 'review-1',
        employeeId: mockEmployeeId,
        reviewTitle: '2026 Annual Merit Review',
        currentSalary: 200000,
        proposedSalary: 230000,
        percentageIncrease: 15,
        status: CompensationReviewStatus.SUBMITTED,
      });

      const res = await service.createCompensationReview(mockOrgId, {
        employeeId: mockEmployeeId,
        reviewTitle: '2026 Annual Merit Review',
        currentSalary: 200000,
        proposedSalary: 230000,
        effectiveDate: '2026-10-01',
      });

      expect(res.percentageIncrease).toBe(15);
      expect(mockPrismaService.compensationReview.create).toHaveBeenCalled();
    });
  });

  describe('updateCompensationReviewStatus', () => {
    it('should update employee basic salary when review is APPROVED', async () => {
      mockPrismaService.compensationReview.findFirst.mockResolvedValue({
        id: 'review-1',
        organizationId: mockOrgId,
        employeeId: mockEmployeeId,
        currentSalary: 200000,
        proposedSalary: 230000,
        percentageIncrease: 15,
        effectiveDate: new Date(),
      });

      mockPrismaService.compensationReview.update.mockResolvedValue({
        id: 'review-1',
        status: CompensationReviewStatus.APPROVED,
      });

      const res = await service.updateCompensationReviewStatus(mockOrgId, 'review-1', {
        status: CompensationReviewStatus.APPROVED,
      });

      expect(res.status).toBe(CompensationReviewStatus.APPROVED);
      expect(mockPrismaService.employee.update).toHaveBeenCalledWith({
        where: { id: mockEmployeeId },
        data: { basicSalary: 230000 },
      });
    });
  });
});
