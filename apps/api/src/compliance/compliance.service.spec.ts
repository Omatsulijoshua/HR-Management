import { Test, TestingModule } from '@nestjs/testing';
import { ComplianceService } from './compliance.service';
import { PrismaService } from '../prisma/prisma.service';
import { ConflictException, NotFoundException } from '@nestjs/common';

describe('ComplianceService', () => {
  let service: ComplianceService;
  let prisma: PrismaService;

  const mockPrismaService = {
    companyPolicy: {
      findUnique: jest.fn(),
      findMany: jest.fn(),
      findFirst: jest.fn(),
      create: jest.fn(),
    },
    policyAcknowledgment: {
      upsert: jest.fn(),
    },
    hseIncident: {
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
        ComplianceService,
        { provide: PrismaService, useValue: mockPrismaService },
      ],
    }).compile();

    service = module.get<ComplianceService>(ComplianceService);
    prisma = module.get<PrismaService>(PrismaService);

    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('createPolicy', () => {
    it('should create company policy successfully', async () => {
      mockPrismaService.companyPolicy.findUnique.mockResolvedValue(null);
      mockPrismaService.companyPolicy.create.mockResolvedValue({
        id: 'pol-1',
        title: 'Information Security Policy',
        code: 'SEC_POL_2026',
      });

      const result = await service.createPolicy('org-1', {
        title: 'Information Security Policy',
        code: 'SEC_POL_2026',
      });

      expect(result.id).toBe('pol-1');
      expect(prisma.companyPolicy.create).toHaveBeenCalled();
    });

    it('should throw ConflictException if policy code exists', async () => {
      mockPrismaService.companyPolicy.findUnique.mockResolvedValue({ id: 'pol-existing' });

      await expect(
        service.createPolicy('org-1', {
          title: 'Information Security Policy',
          code: 'SEC_POL_2026',
        })
      ).rejects.toThrow(ConflictException);
    });
  });

  describe('reportIncident', () => {
    it('should report HSE incident with formatted incident number', async () => {
      mockPrismaService.hseIncident.count.mockResolvedValue(0);
      mockPrismaService.hseIncident.create.mockResolvedValue({
        id: 'hse-1',
        incidentNumber: 'HSE-00001',
        title: 'Slippery Floor Hazard',
      });

      const result = await service.reportIncident('org-1', 'emp-1', {
        title: 'Slippery Floor Hazard',
        description: 'Water leak near elevator lobby',
      });

      expect(result.incidentNumber).toBe('HSE-00001');
      expect(prisma.hseIncident.create).toHaveBeenCalled();
    });
  });
});
