import { Test, TestingModule } from '@nestjs/testing';
import { BadRequestException } from '@nestjs/common';
import { AttendanceService } from './attendance.service';
import { PrismaService } from '../prisma/prisma.service';
import { AuditLogService } from '../audit/audit.service';

describe('AttendanceService', () => {
  let service: AttendanceService;
  let prismaService: any;
  let auditLogService: any;

  beforeEach(async () => {
    prismaService = {
      employee: {
        findFirst: jest.fn(),
      },
      attendanceRecord: {
        findFirst: jest.fn(),
        findMany: jest.fn(),
        create: jest.fn(),
        update: jest.fn(),
      },
      attendanceCorrection: {
        create: jest.fn(),
        findFirst: jest.fn(),
        findMany: jest.fn(),
        update: jest.fn(),
      },
      $transaction: jest.fn((cb) => cb(prismaService)),
    };

    auditLogService = {
      log: jest.fn().mockResolvedValue(true),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AttendanceService,
        { provide: PrismaService, useValue: prismaService },
        { provide: AuditLogService, useValue: auditLogService },
      ],
    }).compile();

    service = module.get<AttendanceService>(AttendanceService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('clockIn', () => {
    it('should throw BadRequestException if user has no employee profile', async () => {
      prismaService.employee.findFirst.mockResolvedValue(null);

      await expect(
        service.clockIn('org-1', 'u-1', {}),
      ).rejects.toThrow(BadRequestException);
    });

    it('should throw BadRequestException if already clocked in today', async () => {
      prismaService.employee.findFirst.mockResolvedValue({ id: 'emp-1' });
      prismaService.attendanceRecord.findFirst.mockResolvedValue({
        id: 'att-1',
        clockIn: new Date(),
      });

      await expect(
        service.clockIn('org-1', 'u-1', {}),
      ).rejects.toThrow(BadRequestException);
    });

    it('should create attendance record on valid clock-in', async () => {
      prismaService.employee.findFirst.mockResolvedValue({ id: 'emp-1' });
      prismaService.attendanceRecord.findFirst.mockResolvedValue(null);
      prismaService.attendanceRecord.create.mockResolvedValue({
        id: 'att-1',
        status: 'PRESENT',
      });

      const res = await service.clockIn('org-1', 'u-1', {});
      expect(res.id).toBe('att-1');
      expect(auditLogService.log).toHaveBeenCalled();
    });
  });
});
