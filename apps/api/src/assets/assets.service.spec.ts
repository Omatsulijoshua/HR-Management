import { Test, TestingModule } from '@nestjs/testing';
import { AssetsService } from './assets.service';
import { PrismaService } from '../prisma/prisma.service';
import { ConflictException, NotFoundException } from '@nestjs/common';

describe('AssetsService', () => {
  let service: AssetsService;
  let prisma: PrismaService;

  const mockPrismaService = {
    companyAsset: {
      findUnique: jest.fn(),
      findMany: jest.fn(),
      findFirst: jest.fn(),
      create: jest.fn(),
      update: jest.fn(),
    },
    assetAssignmentHistory: {
      create: jest.fn(),
    },
    assetRequest: {
      create: jest.fn(),
      findMany: jest.fn(),
    },
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AssetsService,
        { provide: PrismaService, useValue: mockPrismaService },
      ],
    }).compile();

    service = module.get<AssetsService>(AssetsService);
    prisma = module.get<PrismaService>(PrismaService);

    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('createAsset', () => {
    it('should create corporate asset successfully', async () => {
      mockPrismaService.companyAsset.findUnique.mockResolvedValue(null);
      mockPrismaService.companyAsset.create.mockResolvedValue({
        id: 'ast-1',
        name: 'MacBook Pro M3 Max',
        assetTag: 'TAG-MBP-001',
      });

      const result = await service.createAsset('org-1', {
        name: 'MacBook Pro M3 Max',
        assetTag: 'TAG-MBP-001',
      });

      expect(result.id).toBe('ast-1');
      expect(prisma.companyAsset.create).toHaveBeenCalled();
    });

    it('should throw ConflictException if asset tag exists', async () => {
      mockPrismaService.companyAsset.findUnique.mockResolvedValue({ id: 'ast-existing' });

      await expect(
        service.createAsset('org-1', {
          name: 'MacBook Pro',
          assetTag: 'TAG-MBP-001',
        })
      ).rejects.toThrow(ConflictException);
    });
  });

  describe('assignAsset', () => {
    it('should assign asset to employee', async () => {
      mockPrismaService.companyAsset.findFirst.mockResolvedValue({ id: 'ast-1' });
      mockPrismaService.companyAsset.update.mockResolvedValue({
        id: 'ast-1',
        status: 'ASSIGNED',
        assignedToId: 'emp-1',
      });

      const result = await service.assignAsset('org-1', {
        assetId: 'ast-1',
        employeeId: 'emp-1',
      });

      expect(result.status).toBe('ASSIGNED');
      expect(prisma.assetAssignmentHistory.create).toHaveBeenCalled();
    });
  });
});
