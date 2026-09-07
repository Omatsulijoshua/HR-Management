import { Test, TestingModule } from '@nestjs/testing';
import { AnalyticsService } from './analytics.service';
import { PrismaService } from '../prisma/prisma.service';
import { ReportType } from './dto/analytics.dto';

describe('AnalyticsService', () => {
  let service: AnalyticsService;
  let prisma: PrismaService;

  const mockPrismaService = {
    employee: {
      count: jest.fn(),
      groupBy: jest.fn(),
      findMany: jest.fn(),
    },
    department: {
      count: jest.fn(),
      findMany: jest.fn(),
    },
    jobPosting: {
      count: jest.fn(),
    },
    hseIncident: {
      count: jest.fn(),
    },
    payrollEntry: {
      aggregate: jest.fn(),
      findMany: jest.fn(),
    },
    attendanceRecord: {
      findMany: jest.fn(),
    },
    employeeStatusHistory: {
      findMany: jest.fn(),
    },
    trainingEnrollment: {
      findMany: jest.fn(),
    },
    expenseClaim: {
      findMany: jest.fn(),
    },
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AnalyticsService,
        { provide: PrismaService, useValue: mockPrismaService },
      ],
    }).compile();

    service = module.get<AnalyticsService>(AnalyticsService);
    prisma = module.get<PrismaService>(PrismaService);

    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('getExecutiveOverview', () => {
    it('should aggregate executive overview metrics correctly', async () => {
      mockPrismaService.employee.count.mockResolvedValue(150);
      mockPrismaService.department.count.mockResolvedValue(5);
      mockPrismaService.jobPosting.count.mockResolvedValue(3);
      mockPrismaService.hseIncident.count.mockResolvedValue(1);

      mockPrismaService.employee.groupBy.mockResolvedValue([
        { departmentId: 'dept-1', _count: { _all: 80 } },
        { departmentId: 'dept-2', _count: { _all: 70 } },
      ]);

      mockPrismaService.department.findMany.mockResolvedValue([
        { id: 'dept-1', name: 'Engineering', code: 'ENG' },
        { id: 'dept-2', name: 'HR', code: 'HR' },
      ]);

      mockPrismaService.payrollEntry.aggregate.mockResolvedValue({
        _sum: { grossSalary: 750000, netPay: 600000, totalDeductions: 150000 },
        _count: { _all: 150 },
      });

      const res = await service.getExecutiveOverview('org-1');

      expect(res.kpis.totalHeadcount).toBe(150);
      expect(res.kpis.monthlyPayrollSpend).toBe(750000);
      expect(res.kpis.averageSalary).toBe(5000);
      expect(res.departmentDistribution).toHaveLength(2);
    });
  });

  describe('generateReport', () => {
    it('should generate headcount report', async () => {
      mockPrismaService.employee.findMany.mockResolvedValue([
        {
          employeeCode: 'EMP-001',
          firstName: 'John',
          lastName: 'Doe',
          email: 'john@example.com',
          status: 'ACTIVE',
          hireDate: new Date('2025-01-01'),
          department: { name: 'Engineering' },
          position: { title: 'Senior Developer' },
        },
      ]);

      const res = await service.generateReport('org-1', { reportType: ReportType.HEADCOUNT });

      expect(res.reportType).toBe(ReportType.HEADCOUNT);
      expect(res.totalRecords).toBe(1);
      expect(res.rows[0][0]).toBe('EMP-001');
    });
  });
});
