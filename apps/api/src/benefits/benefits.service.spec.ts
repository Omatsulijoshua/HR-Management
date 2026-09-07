import { Test, TestingModule } from '@nestjs/testing';
import { BenefitsService } from './benefits.service';
import { PrismaService } from '../prisma/prisma.service';
import { BenefitType, EnrollmentStatus } from '@prisma/client';
import { NotFoundException } from '@nestjs/common';

describe('BenefitsService', () => {
  let service: BenefitsService;
  let prisma: PrismaService;

  const mockOrgId = 'org-uuid-1';
  const mockEmployeeId = 'emp-uuid-1';
  const mockPlanId = 'plan-uuid-1';
  const mockOptionId = 'option-uuid-1';

  const mockPrismaService = {
    benefitPlan: {
      findUnique: jest.fn(),
      create: jest.fn(),
      findMany: jest.fn(),
      findFirst: jest.fn(),
    },
    benefitOption: {
      findFirst: jest.fn(),
    },
    employee: {
      findFirst: jest.fn(),
    },
    employeeBenefitEnrollment: {
      create: jest.fn(),
      update: jest.fn(),
      findFirst: jest.fn(),
      findMany: jest.fn(),
    },
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        BenefitsService,
        {
          provide: PrismaService,
          useValue: mockPrismaService,
        },
      ],
    }).compile();

    service = module.get<BenefitsService>(BenefitsService);
    prisma = module.get<PrismaService>(PrismaService);
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('createBenefitPlan', () => {
    it('should create a benefit plan with tier options', async () => {
      mockPrismaService.benefitPlan.findUnique.mockResolvedValue(null);
      mockPrismaService.benefitPlan.create.mockResolvedValue({
        id: mockPlanId,
        organizationId: mockOrgId,
        name: 'Executive Medical Cover',
        code: 'MED_EXEC',
        type: BenefitType.HEALTH_INSURANCE,
        options: [
          { id: mockOptionId, name: 'Family Cover', coverageTier: 'Family', employeeContribution: 10000, employerContribution: 40000 },
        ],
      });

      const res = await service.createBenefitPlan(mockOrgId, {
        name: 'Executive Medical Cover',
        code: 'MED_EXEC',
        type: BenefitType.HEALTH_INSURANCE,
        options: [
          { name: 'Family Cover', coverageTier: 'Family', employeeContribution: 10000, employerContribution: 40000 },
        ],
      });

      expect(res.name).toBe('Executive Medical Cover');
      expect(mockPrismaService.benefitPlan.create).toHaveBeenCalled();
    });
  });

  describe('enrollEmployee', () => {
    it('should enroll an employee in a benefit option', async () => {
      mockPrismaService.employee.findFirst.mockResolvedValue({ id: mockEmployeeId });
      mockPrismaService.benefitPlan.findFirst.mockResolvedValue({ id: mockPlanId });
      mockPrismaService.benefitOption.findFirst.mockResolvedValue({ id: mockOptionId });
      mockPrismaService.employeeBenefitEnrollment.create.mockResolvedValue({
        id: 'enrollment-1',
        employeeId: mockEmployeeId,
        benefitPlanId: mockPlanId,
        benefitOptionId: mockOptionId,
        status: EnrollmentStatus.PENDING,
      });

      const result = await service.enrollEmployee(mockOrgId, {
        employeeId: mockEmployeeId,
        benefitPlanId: mockPlanId,
        benefitOptionId: mockOptionId,
        effectiveFrom: '2026-10-01',
      });

      expect(result.status).toBe(EnrollmentStatus.PENDING);
    });

    it('should throw NotFoundException if employee not found', async () => {
      mockPrismaService.employee.findFirst.mockResolvedValue(null);

      await expect(
        service.enrollEmployee(mockOrgId, {
          employeeId: 'invalid-emp',
          benefitPlanId: mockPlanId,
          benefitOptionId: mockOptionId,
          effectiveFrom: '2026-10-01',
        }),
      ).rejects.toThrow(NotFoundException);
    });
  });
});
