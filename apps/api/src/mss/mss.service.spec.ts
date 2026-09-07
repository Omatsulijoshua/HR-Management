import { Test, TestingModule } from '@nestjs/testing';
import { MssService } from './mss.service';
import { PrismaService } from '../prisma/prisma.service';

describe('MssService', () => {
  let service: MssService;
  let prisma: PrismaService;

  const mockPrismaService = {
    employee: {
      findMany: jest.fn(),
    },
    managerDelegation: {
      create: jest.fn(),
      findMany: jest.fn(),
    },
    oneOnOneMeeting: {
      create: jest.fn(),
      findMany: jest.fn(),
    },
    leaveRequest: {
      findMany: jest.fn(),
    },
    overtimeRecord: {
      findMany: jest.fn(),
    },
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        MssService,
        { provide: PrismaService, useValue: mockPrismaService },
      ],
    }).compile();

    service = module.get<MssService>(MssService);
    prisma = module.get<PrismaService>(PrismaService);

    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('getMyTeam', () => {
    it('should return manager direct reports', async () => {
      mockPrismaService.employee.findMany.mockResolvedValue([
        { id: 'emp-2', firstName: 'Amina', lastName: 'Bello' },
      ]);

      const result = await service.getMyTeam('org-1', 'mgr-1');
      expect(result).toHaveLength(1);
      expect(prisma.employee.findMany).toHaveBeenCalled();
    });
  });

  describe('createDelegation', () => {
    it('should create manager authority delegation', async () => {
      mockPrismaService.managerDelegation.create.mockResolvedValue({
        id: 'del-1',
        managerId: 'mgr-1',
        delegateId: 'emp-2',
        status: 'ACTIVE',
      });

      const result = await service.createDelegation('org-1', 'mgr-1', {
        delegateId: 'emp-2',
        startDate: '2026-09-10',
        endDate: '2026-09-20',
        reason: 'Annual Leave',
      });

      expect(result.id).toBe('del-1');
      expect(prisma.managerDelegation.create).toHaveBeenCalled();
    });
  });
});
