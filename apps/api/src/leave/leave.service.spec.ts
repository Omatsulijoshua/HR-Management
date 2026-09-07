import { Test, TestingModule } from '@nestjs/testing';
import { BadRequestException } from '@nestjs/common';
import { LeaveService } from './leave.service';
import { PrismaService } from '../prisma/prisma.service';
import { AuditLogService } from '../audit/audit.service';
import { LeaveRequestStatus } from '@prisma/client';

describe('LeaveService', () => {
  let service: LeaveService;
  let prismaService: any;
  let auditLogService: any;

  beforeEach(async () => {
    prismaService = {
      employee: {
        findFirst: jest.fn(),
      },
      leaveType: {
        findMany: jest.fn(),
        findUnique: jest.fn(),
        create: jest.fn(),
      },
      leaveBalance: {
        upsert: jest.fn(),
        findMany: jest.fn(),
        findUnique: jest.fn(),
        update: jest.fn(),
      },
      leaveRequest: {
        create: jest.fn(),
        findMany: jest.fn(),
        findFirst: jest.fn(),
        update: jest.fn(),
      },
      $transaction: jest.fn((cb) => cb(prismaService)),
    };

    auditLogService = {
      log: jest.fn().mockResolvedValue(true),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        LeaveService,
        { provide: PrismaService, useValue: prismaService },
        { provide: AuditLogService, useValue: auditLogService },
      ],
    }).compile();

    service = module.get<LeaveService>(LeaveService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('requestLeave', () => {
    it('should throw BadRequestException if balance is insufficient', async () => {
      prismaService.employee.findFirst.mockResolvedValue({ id: 'emp-1' });
      prismaService.leaveBalance.findUnique.mockResolvedValue({
        id: 'bal-1',
        remainingDays: 2,
        pendingDays: 0,
      });

      await expect(
        service.requestLeave('org-1', 'u-1', {
          leaveTypeId: 'lt-annual',
          startDate: '2026-10-01',
          endDate: '2026-10-10',
          totalDays: 7,
          reason: 'Vacation',
        }),
      ).rejects.toThrow(BadRequestException);
    });

    it('should create leave request and increment pending balance', async () => {
      prismaService.employee.findFirst.mockResolvedValue({ id: 'emp-1' });
      prismaService.leaveBalance.findUnique.mockResolvedValue({
        id: 'bal-1',
        remainingDays: 20,
        pendingDays: 0,
      });
      prismaService.leaveRequest.create.mockResolvedValue({ id: 'req-1', totalDays: 5 });

      const res = await service.requestLeave('org-1', 'u-1', {
        leaveTypeId: 'lt-annual',
        startDate: '2026-10-01',
        endDate: '2026-10-05',
        totalDays: 5,
        reason: 'Vacation',
      });

      expect(res.id).toBe('req-1');
      expect(prismaService.leaveBalance.update).toHaveBeenCalledWith({
        where: { id: 'bal-1' },
        data: { pendingDays: 5 },
      });
    });
  });

  describe('reviewLeaveRequest', () => {
    it('should deduct remaining balance atomically on approval', async () => {
      prismaService.leaveRequest.findFirst.mockResolvedValue({
        id: 'req-1',
        employeeId: 'emp-1',
        leaveTypeId: 'lt-annual',
        startDate: new Date('2026-10-01'),
        totalDays: 5,
        status: LeaveRequestStatus.PENDING,
      });

      prismaService.leaveBalance.findUnique.mockResolvedValue({
        id: 'bal-1',
        totalDays: 20,
        usedDays: 0,
        pendingDays: 5,
        remainingDays: 20,
      });

      prismaService.leaveRequest.update.mockResolvedValue({
        id: 'req-1',
        status: LeaveRequestStatus.APPROVED,
      });

      const res = await service.reviewLeaveRequest('org-1', 'req-1', 'reviewer-1', {
        status: 'APPROVED',
      });

      expect(res.status).toBe(LeaveRequestStatus.APPROVED);
      expect(prismaService.leaveBalance.update).toHaveBeenCalledWith({
        where: { id: 'bal-1' },
        data: { usedDays: 5, pendingDays: 0, remainingDays: 15 },
      });
    });
  });
});
