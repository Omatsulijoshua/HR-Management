import { Test, TestingModule } from '@nestjs/testing';
import { CareerService } from './career.service';
import { PrismaService } from '../prisma/prisma.service';
import { ConflictException, NotFoundException } from '@nestjs/common';

describe('CareerService', () => {
  let service: CareerService;
  let prisma: PrismaService;

  const mockPrismaService = {
    careerPath: {
      findUnique: jest.fn(),
      findMany: jest.fn(),
      findFirst: jest.fn(),
      create: jest.fn(),
      update: jest.fn(),
    },
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CareerService,
        { provide: PrismaService, useValue: mockPrismaService },
      ],
    }).compile();

    service = module.get<CareerService>(CareerService);
    prisma = module.get<PrismaService>(PrismaService);

    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('createCareerPath', () => {
    it('should create a career path successfully', async () => {
      mockPrismaService.careerPath.findUnique.mockResolvedValue(null);
      mockPrismaService.careerPath.create.mockResolvedValue({
        id: 'cp-1',
        title: 'Engineering Ladder',
        code: 'ENG_LADDER',
      });

      const result = await service.createCareerPath('org-1', {
        title: 'Engineering Ladder',
        code: 'ENG_LADDER',
      });

      expect(result.id).toBe('cp-1');
      expect(prisma.careerPath.create).toHaveBeenCalled();
    });

    it('should throw ConflictException if career path code exists', async () => {
      mockPrismaService.careerPath.findUnique.mockResolvedValue({ id: 'cp-existing' });

      await expect(
        service.createCareerPath('org-1', {
          title: 'Engineering Ladder',
          code: 'ENG_LADDER',
        })
      ).rejects.toThrow(ConflictException);
    });
  });

  describe('findAll', () => {
    it('should return list of career paths', async () => {
      mockPrismaService.careerPath.findMany.mockResolvedValue([{ id: 'cp-1' }]);

      const result = await service.findAll('org-1');
      expect(result).toHaveLength(1);
      expect(prisma.careerPath.findMany).toHaveBeenCalledWith({
        where: { organizationId: 'org-1' },
        include: { department: true },
        orderBy: { createdAt: 'desc' },
      });
    });
  });
});
