import { Test, TestingModule } from '@nestjs/testing';
import { EssService } from './ess.service';
import { PrismaService } from '../prisma/prisma.service';
import { NotFoundException } from '@nestjs/common';

describe('EssService', () => {
  let service: EssService;
  let prisma: PrismaService;

  const mockPrismaService = {
    employee: {
      findFirst: jest.fn(),
      update: jest.fn(),
    },
    leaveBalance: {
      findMany: jest.fn(),
    },
    payrollEntry: {
      findMany: jest.fn(),
    },
    leaveRequest: {
      findMany: jest.fn(),
    },
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        EssService,
        { provide: PrismaService, useValue: mockPrismaService },
      ],
    }).compile();

    service = module.get<EssService>(EssService);
    prisma = module.get<PrismaService>(PrismaService);

    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('getMyProfile', () => {
    it('should return employee profile', async () => {
      mockPrismaService.employee.findFirst.mockResolvedValue({
        id: 'emp-1',
        firstName: 'Omatsuli',
        lastName: 'Joshua',
      });

      const result = await service.getMyProfile('org-1', 'emp-1');
      expect(result.id).toBe('emp-1');
      expect(prisma.employee.findFirst).toHaveBeenCalled();
    });

    it('should throw NotFoundException if profile does not exist', async () => {
      mockPrismaService.employee.findFirst.mockResolvedValue(null);

      await expect(service.getMyProfile('org-1', 'emp-99')).rejects.toThrow(NotFoundException);
    });
  });
});
