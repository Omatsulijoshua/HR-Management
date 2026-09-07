import { Test, TestingModule } from '@nestjs/testing';
import { SurveysService } from './surveys.service';
import { PrismaService } from '../prisma/prisma.service';
import { ConflictException, NotFoundException } from '@nestjs/common';

describe('SurveysService', () => {
  let service: SurveysService;
  let prisma: PrismaService;

  const mockPrismaService = {
    engagementSurvey: {
      findUnique: jest.fn(),
      findMany: jest.fn(),
      findFirst: jest.fn(),
      create: jest.fn(),
    },
    surveyQuestion: {
      create: jest.fn(),
    },
    surveyResponse: {
      create: jest.fn(),
    },
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        SurveysService,
        { provide: PrismaService, useValue: mockPrismaService },
      ],
    }).compile();

    service = module.get<SurveysService>(SurveysService);
    prisma = module.get<PrismaService>(PrismaService);

    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('createSurvey', () => {
    it('should create survey successfully', async () => {
      mockPrismaService.engagementSurvey.findUnique.mockResolvedValue(null);
      mockPrismaService.engagementSurvey.create.mockResolvedValue({
        id: 'sv-1',
        title: 'Q3 Pulse Survey',
        code: 'PULSE_Q3',
      });

      const result = await service.createSurvey('org-1', {
        title: 'Q3 Pulse Survey',
        code: 'PULSE_Q3',
      });

      expect(result.id).toBe('sv-1');
      expect(prisma.engagementSurvey.create).toHaveBeenCalled();
    });

    it('should throw ConflictException if survey code exists', async () => {
      mockPrismaService.engagementSurvey.findUnique.mockResolvedValue({ id: 'sv-existing' });

      await expect(
        service.createSurvey('org-1', {
          title: 'Q3 Pulse Survey',
          code: 'PULSE_Q3',
        })
      ).rejects.toThrow(ConflictException);
    });
  });

  describe('submitResponse', () => {
    it('should submit survey response successfully', async () => {
      mockPrismaService.engagementSurvey.findFirst.mockResolvedValue({ id: 'sv-1' });
      mockPrismaService.surveyResponse.create.mockResolvedValue({
        id: 'sr-1',
        surveyId: 'sv-1',
        score: 4.5,
      });

      const result = await service.submitResponse('org-1', 'emp-1', {
        surveyId: 'sv-1',
        answers: { q1: 5, q2: 4 },
        score: 4.5,
      });

      expect(result.id).toBe('sr-1');
      expect(prisma.surveyResponse.create).toHaveBeenCalled();
    });
  });
});
