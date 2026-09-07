import { Test, TestingModule } from '@nestjs/testing';
import { FeedbackService } from './feedback.service';
import { PrismaService } from '../prisma/prisma.service';
import { FeedbackStatus } from '@prisma/client';

describe('FeedbackService', () => {
  let service: FeedbackService;
  let prisma: PrismaService;

  const mockPrismaService = {
    anonymousFeedback: {
      create: jest.fn(),
      findMany: jest.fn(),
      findFirst: jest.fn(),
      update: jest.fn(),
    },
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        FeedbackService,
        { provide: PrismaService, useValue: mockPrismaService },
      ],
    }).compile();

    service = module.get<FeedbackService>(FeedbackService);
    prisma = module.get<PrismaService>(PrismaService);

    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('submitFeedback', () => {
    it('should create anonymous feedback entry', async () => {
      mockPrismaService.anonymousFeedback.create.mockResolvedValue({
        id: 'fb-1',
        message: 'Improve workplace flexibility',
        status: 'PENDING',
      });

      const result = await service.submitFeedback('org-1', {
        message: 'Improve workplace flexibility',
        category: 'Work Environment',
      });

      expect(result.id).toBe('fb-1');
      expect(prisma.anonymousFeedback.create).toHaveBeenCalled();
    });
  });

  describe('updateStatus', () => {
    it('should update feedback status', async () => {
      mockPrismaService.anonymousFeedback.findFirst.mockResolvedValue({ id: 'fb-1' });
      mockPrismaService.anonymousFeedback.update.mockResolvedValue({
        id: 'fb-1',
        status: FeedbackStatus.REVIEWED,
      });

      const result = await service.updateStatus('org-1', 'fb-1', {
        status: FeedbackStatus.REVIEWED,
        responseNote: 'Acknowledged by HR',
      });

      expect(result.status).toBe(FeedbackStatus.REVIEWED);
    });
  });
});
