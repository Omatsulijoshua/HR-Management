import { Test, TestingModule } from '@nestjs/testing';
import { ExpensesService } from './expenses.service';
import { PrismaService } from '../prisma/prisma.service';
import { ExpenseStatus } from '@prisma/client';

describe('ExpensesService', () => {
  let service: ExpensesService;
  let prisma: PrismaService;

  const mockPrismaService = {
    expenseClaim: {
      count: jest.fn(),
      create: jest.fn(),
      findMany: jest.fn(),
      findFirst: jest.fn(),
      update: jest.fn(),
    },
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ExpensesService,
        { provide: PrismaService, useValue: mockPrismaService },
      ],
    }).compile();

    service = module.get<ExpensesService>(ExpensesService);
    prisma = module.get<PrismaService>(PrismaService);

    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('createClaim', () => {
    it('should create expense claim with formatted claim number', async () => {
      mockPrismaService.expenseClaim.count.mockResolvedValue(0);
      mockPrismaService.expenseClaim.create.mockResolvedValue({
        id: 'clm-1',
        claimNumber: 'CLM-00001',
        amount: 45000,
        status: 'SUBMITTED',
      });

      const result = await service.createClaim('org-1', 'emp-1', {
        title: 'Cloud Certification Fee',
        amount: 45000,
      });

      expect(result.claimNumber).toBe('CLM-00001');
      expect(prisma.expenseClaim.create).toHaveBeenCalled();
    });
  });

  describe('updateStatus', () => {
    it('should update claim status to MANAGER_APPROVED', async () => {
      mockPrismaService.expenseClaim.findFirst.mockResolvedValue({ id: 'clm-1' });
      mockPrismaService.expenseClaim.update.mockResolvedValue({
        id: 'clm-1',
        status: ExpenseStatus.MANAGER_APPROVED,
      });

      const result = await service.updateStatus('org-1', 'clm-1', {
        status: ExpenseStatus.MANAGER_APPROVED,
        managerNotes: 'Approved receipt verified',
      });

      expect(result.status).toBe(ExpenseStatus.MANAGER_APPROVED);
    });
  });
});
