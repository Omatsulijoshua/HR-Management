import { Test, TestingModule } from '@nestjs/testing';
import { SuccessionService } from './succession.service';
import { PrismaService } from '../prisma/prisma.service';
import { ConflictException, NotFoundException } from '@nestjs/common';

describe('SuccessionService', () => {
  let service: SuccessionService;
  let prisma: PrismaService;

  const mockPrismaService = {
    successionPlan: {
      findUnique: jest.fn(),
      findMany: jest.fn(),
      findFirst: jest.fn(),
      create: jest.fn(),
    },
    successionCandidate: {
      create: jest.fn(),
    },
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        SuccessionService,
        { provide: PrismaService, useValue: mockPrismaService },
      ],
    }).compile();

    service = module.get<SuccessionService>(SuccessionService);
    prisma = module.get<PrismaService>(PrismaService);

    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('createSuccessionPlan', () => {
    it('should create succession plan successfully', async () => {
      mockPrismaService.successionPlan.findUnique.mockResolvedValue(null);
      mockPrismaService.successionPlan.create.mockResolvedValue({
        id: 'sp-1',
        jobPositionId: 'pos-1',
        riskOfLoss: 'HIGH',
      });

      const result = await service.createSuccessionPlan('org-1', {
        jobPositionId: 'pos-1',
        riskOfLoss: 'HIGH',
      });

      expect(result.id).toBe('sp-1');
      expect(prisma.successionPlan.create).toHaveBeenCalled();
    });

    it('should throw ConflictException if plan already exists for position', async () => {
      mockPrismaService.successionPlan.findUnique.mockResolvedValue({ id: 'sp-existing' });

      await expect(
        service.createSuccessionPlan('org-1', {
          jobPositionId: 'pos-1',
        })
      ).rejects.toThrow(ConflictException);
    });
  });

  describe('addCandidate', () => {
    it('should add candidate to succession plan', async () => {
      mockPrismaService.successionPlan.findFirst.mockResolvedValue({ id: 'sp-1' });
      mockPrismaService.successionCandidate.create.mockResolvedValue({
        id: 'sc-1',
        candidateId: 'emp-1',
      });

      const result = await service.addCandidate('org-1', {
        successionPlanId: 'sp-1',
        candidateId: 'emp-1',
      });

      expect(result.id).toBe('sc-1');
      expect(prisma.successionCandidate.create).toHaveBeenCalled();
    });
  });
});
