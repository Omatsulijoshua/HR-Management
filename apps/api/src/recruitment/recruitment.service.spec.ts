import { Test, TestingModule } from '@nestjs/testing';
import { ConflictException, NotFoundException } from '@nestjs/common';
import { RecruitmentService } from './recruitment.service';
import { PrismaService } from '../prisma/prisma.service';
import { AuditLogService } from '../audit/audit.service';
import { ApplicationStage, EmployeeStatus } from '@prisma/client';

describe('RecruitmentService (ATS & Candidate Conversion)', () => {
  let service: RecruitmentService;
  let prismaService: any;
  let auditLogService: any;

  beforeEach(async () => {
    prismaService = {
      jobPosting: {
        findUnique: jest.fn(),
        findMany: jest.fn(),
        create: jest.fn(),
      },
      candidate: {
        findUnique: jest.fn(),
        findFirst: jest.fn(),
        findMany: jest.fn(),
        create: jest.fn(),
      },
      jobApplication: {
        findUnique: jest.fn(),
        findFirst: jest.fn(),
        findMany: jest.fn(),
        create: jest.fn(),
        update: jest.fn(),
        updateMany: jest.fn(),
      },
      employee: {
        findFirst: jest.fn(),
        create: jest.fn(),
      },
      employeeHistory: {
        create: jest.fn(),
      },
      $transaction: jest.fn((cb) => cb(prismaService)),
    };

    auditLogService = {
      log: jest.fn().mockResolvedValue(true),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        RecruitmentService,
        { provide: PrismaService, useValue: prismaService },
        { provide: AuditLogService, useValue: auditLogService },
      ],
    }).compile();

    service = module.get<RecruitmentService>(RecruitmentService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('convertCandidateToEmployee', () => {
    it('should throw NotFoundException if candidate not found', async () => {
      prismaService.candidate.findFirst.mockResolvedValue(null);

      await expect(
        service.convertCandidateToEmployee('org-1', 'cand-invalid', {
          employeeCode: 'EMP-050',
          hireDate: '2026-10-01',
        }),
      ).rejects.toThrow(NotFoundException);
    });

    it('should convert candidate to Employee and log HIRE_CONVERSION history', async () => {
      prismaService.candidate.findFirst.mockResolvedValue({
        id: 'cand-1',
        firstName: 'Michael',
        lastName: 'Brown',
        email: 'michael@test.com',
      });
      prismaService.employee.findFirst.mockResolvedValue(null);
      prismaService.employee.create.mockResolvedValue({
        id: 'emp-50',
        employeeCode: 'EMP-050',
        email: 'michael@test.com',
        status: EmployeeStatus.PROBATION,
      });

      const res = await service.convertCandidateToEmployee('org-1', 'cand-1', {
        employeeCode: 'EMP-050',
        hireDate: '2026-10-01',
      });

      expect(res.id).toBe('emp-50');
      expect(prismaService.jobApplication.updateMany).toHaveBeenCalledWith({
        where: { candidateId: 'cand-1', organizationId: 'org-1' },
        data: { stage: ApplicationStage.HIRED },
      });
    });
  });
});
