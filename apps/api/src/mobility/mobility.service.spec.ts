import { Test, TestingModule } from '@nestjs/testing';
import { MobilityService } from './mobility.service';
import { PrismaService } from '../prisma/prisma.service';
import { NotFoundException } from '@nestjs/common';
import { MobilityRequestStatus } from '@prisma/client';

describe('MobilityService', () => {
  let service: MobilityService;
  let prisma: PrismaService;

  const mockPrismaService = {
    internalMobilityRequest: {
      create: jest.fn(),
      findMany: jest.fn(),
      findFirst: jest.fn(),
      update: jest.fn(),
    },
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        MobilityService,
        { provide: PrismaService, useValue: mockPrismaService },
      ],
    }).compile();

    service = module.get<MobilityService>(MobilityService);
    prisma = module.get<PrismaService>(PrismaService);

    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('createRequest', () => {
    it('should create mobility request successfully', async () => {
      mockPrismaService.internalMobilityRequest.create.mockResolvedValue({
        id: 'mr-1',
        employeeId: 'emp-1',
        status: 'SUBMITTED',
      });

      const result = await service.createRequest('org-1', {
        employeeId: 'emp-1',
        targetPositionId: 'pos-2',
        reason: 'Career development lateral move',
      });

      expect(result.id).toBe('mr-1');
      expect(prisma.internalMobilityRequest.create).toHaveBeenCalled();
    });
  });

  describe('updateStatus', () => {
    it('should update request status', async () => {
      mockPrismaService.internalMobilityRequest.findFirst.mockResolvedValue({ id: 'mr-1' });
      mockPrismaService.internalMobilityRequest.update.mockResolvedValue({
        id: 'mr-1',
        status: MobilityRequestStatus.MANAGER_APPROVED,
      });

      const result = await service.updateStatus('org-1', 'mr-1', {
        status: MobilityRequestStatus.MANAGER_APPROVED,
        managerReview: 'Approved for interview',
      });

      expect(result.status).toBe(MobilityRequestStatus.MANAGER_APPROVED);
    });
  });
});
