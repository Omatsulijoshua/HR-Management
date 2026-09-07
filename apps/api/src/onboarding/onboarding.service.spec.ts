import { Test, TestingModule } from '@nestjs/testing';
import { OnboardingService } from './onboarding.service';
import { PrismaService } from '../prisma/prisma.service';
import { AuditLogService } from '../audit/audit.service';
import { TaskStatus } from '@prisma/client';

describe('OnboardingService', () => {
  let service: OnboardingService;
  let prismaService: any;
  let auditLogService: any;

  beforeEach(async () => {
    prismaService = {
      employee: {
        findFirst: jest.fn(),
      },
      onboardingTemplate: {
        findMany: jest.fn(),
        findFirst: jest.fn(),
        create: jest.fn(),
      },
      employeeOnboardingProcess: {
        create: jest.fn(),
        findMany: jest.fn(),
        update: jest.fn(),
      },
      employeeOnboardingTask: {
        findUnique: jest.fn(),
        findMany: jest.fn(),
        update: jest.fn(),
      },
    };

    auditLogService = {
      log: jest.fn().mockResolvedValue(true),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        OnboardingService,
        { provide: PrismaService, useValue: prismaService },
        { provide: AuditLogService, useValue: auditLogService },
      ],
    }).compile();

    service = module.get<OnboardingService>(OnboardingService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('updateTaskStatus', () => {
    it('should update task status and recalculate process progress percentage', async () => {
      prismaService.employeeOnboardingTask.findUnique.mockResolvedValue({
        id: 't-1',
        processId: 'p-1',
        process: { organizationId: 'org-1' },
      });

      prismaService.employeeOnboardingTask.update.mockResolvedValue({
        id: 't-1',
        status: TaskStatus.COMPLETED,
      });

      prismaService.employeeOnboardingTask.findMany.mockResolvedValue([
        { id: 't-1', status: TaskStatus.COMPLETED },
        { id: 't-2', status: TaskStatus.PENDING },
      ]);

      await service.updateTaskStatus('org-1', 't-1', { status: TaskStatus.COMPLETED });

      expect(prismaService.employeeOnboardingProcess.update).toHaveBeenCalledWith({
        where: { id: 'p-1' },
        data: { progressPercentage: 50, isCompleted: false },
      });
    });
  });
});
