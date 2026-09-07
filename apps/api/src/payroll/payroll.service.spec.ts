import { Test, TestingModule } from '@nestjs/testing';
import { PayrollService } from './payroll.service';
import { PrismaService } from '../prisma/prisma.service';
import { SalaryComponentType, CalculationType, PayrollRunStatus, PayrollFrequency } from '@prisma/client';
import { BadRequestException, NotFoundException } from '@nestjs/common';

describe('PayrollService', () => {
  let service: PayrollService;
  let prisma: PrismaService;

  const mockOrgId = 'org-uuid-1';
  const mockEmployeeId = 'emp-uuid-1';
  const mockPeriodId = 'period-uuid-1';

  const mockPrismaService = {
    salaryComponent: {
      findUnique: jest.fn(),
      create: jest.fn(),
      findMany: jest.fn(),
    },
    salaryStructure: {
      findUnique: jest.fn(),
      create: jest.fn(),
      findMany: jest.fn(),
      findFirst: jest.fn(),
    },
    employeeSalaryAssignment: {
      updateMany: jest.fn(),
      create: jest.fn(),
    },
    employee: {
      findFirst: jest.fn(),
      update: jest.fn(),
      findMany: jest.fn(),
    },
    payrollPeriod: {
      create: jest.fn(),
      findMany: jest.fn(),
      findFirst: jest.fn(),
      update: jest.fn(),
    },
    payrollRun: {
      findFirst: jest.fn(),
      delete: jest.fn(),
      create: jest.fn(),
      update: jest.fn(),
    },
    payrollEntry: {
      create: jest.fn(),
      findMany: jest.fn(),
      findFirst: jest.fn(),
    },
    $transaction: jest.fn((callback) => callback(mockPrismaService)),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        PayrollService,
        {
          provide: PrismaService,
          useValue: mockPrismaService,
        },
      ],
    }).compile();

    service = module.get<PayrollService>(PayrollService);
    prisma = module.get<PrismaService>(PrismaService);
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('createSalaryComponent', () => {
    it('should create a salary component', async () => {
      mockPrismaService.salaryComponent.findUnique.mockResolvedValue(null);
      mockPrismaService.salaryComponent.create.mockResolvedValue({
        id: 'comp-1',
        organizationId: mockOrgId,
        name: 'Housing Allowance',
        code: 'HOUSING',
        type: SalaryComponentType.EARNING,
        calculationType: CalculationType.FIXED,
        defaultAmount: 50000,
      });

      const res = await service.createSalaryComponent(mockOrgId, {
        name: 'Housing Allowance',
        code: 'HOUSING',
        type: SalaryComponentType.EARNING,
        defaultAmount: 50000,
      });

      expect(res.name).toBe('Housing Allowance');
      expect(mockPrismaService.salaryComponent.create).toHaveBeenCalled();
    });
  });

  describe('processPayrollRun', () => {
    it('should calculate gross-to-net payroll correctly', async () => {
      mockPrismaService.payrollPeriod.findFirst.mockResolvedValue({
        id: mockPeriodId,
        organizationId: mockOrgId,
        name: 'September 2026',
      });

      mockPrismaService.payrollRun.findFirst.mockResolvedValue(null);

      const mockEmployee = {
        id: mockEmployeeId,
        organizationId: mockOrgId,
        basicSalary: 100000,
        status: 'ACTIVE',
        salaryAssignments: [
          {
            isActive: true,
            baseSalary: 100000,
            salaryStructure: {
              components: [
                {
                  amount: 20000,
                  salaryComponent: {
                    name: 'Housing',
                    type: SalaryComponentType.EARNING,
                    calculationType: CalculationType.FIXED,
                    defaultAmount: 20000,
                  },
                },
              ],
            },
          },
        ],
      };

      mockPrismaService.employee.findMany.mockResolvedValue([mockEmployee]);
      mockPrismaService.payrollRun.create.mockResolvedValue({ id: 'run-1' });
      mockPrismaService.payrollEntry.create.mockResolvedValue({ id: 'entry-1' });
      mockPrismaService.payrollRun.update.mockResolvedValue({
        id: 'run-1',
        status: PayrollRunStatus.DRAFT,
        totalEmployees: 1,
        totalGross: 120000,
        totalPension: 8000, // 8% of 100,000
        totalTax: 11200,   // 10% of (120,000 - 8,000 = 112,000)
        totalNet: 100800,  // 120,000 - (8,000 + 11,200)
      });

      const result = await service.processPayrollRun(mockOrgId, { periodId: mockPeriodId });

      expect(result.totalGross).toBe(120000);
      expect(result.totalPension).toBe(8000);
      expect(result.totalTax).toBe(11200);
      expect(result.totalNet).toBe(100800);
    });

    it('should throw BadRequestException if no active employees found', async () => {
      mockPrismaService.payrollPeriod.findFirst.mockResolvedValue({ id: mockPeriodId });
      mockPrismaService.payrollRun.findFirst.mockResolvedValue(null);
      mockPrismaService.employee.findMany.mockResolvedValue([]);

      await expect(service.processPayrollRun(mockOrgId, { periodId: mockPeriodId })).rejects.toThrow(BadRequestException);
    });
  });

  describe('updatePayrollRunStatus', () => {
    it('should update payroll run status to APPROVED', async () => {
      mockPrismaService.payrollRun.findFirst.mockResolvedValue({
        id: 'run-1',
        organizationId: mockOrgId,
        periodId: mockPeriodId,
        status: PayrollRunStatus.DRAFT,
      });

      mockPrismaService.payrollRun.update.mockResolvedValue({
        id: 'run-1',
        status: PayrollRunStatus.APPROVED,
      });

      const res = await service.updatePayrollRunStatus(mockOrgId, 'run-1', {
        status: PayrollRunStatus.APPROVED,
      });

      expect(res.status).toBe(PayrollRunStatus.APPROVED);
    });
  });
});
