import { Test, TestingModule } from '@nestjs/testing';
import { ConflictException, ForbiddenException } from '@nestjs/common';
import { EmployeesService } from './employees.service';
import { PrismaService } from '../prisma/prisma.service';
import { AuditLogService } from '../audit/audit.service';
import { EmployeeStatus } from '@prisma/client';

describe('EmployeesService (Phase 4 Employee Lifecycle)', () => {
  let service: EmployeesService;
  let prismaService: any;
  let auditLogService: any;

  beforeEach(async () => {
    prismaService = {
      employee: {
        findUnique: jest.fn(),
        findFirst: jest.fn(),
        findMany: jest.fn(),
        count: jest.fn(),
        create: jest.fn(),
        update: jest.fn(),
      },
      employeeHistory: {
        create: jest.fn(),
        findMany: jest.fn(),
      },
      employeeStatusHistory: {
        create: jest.fn(),
      },
      emergencyContact: {
        create: jest.fn(),
        delete: jest.fn(),
      },
      $transaction: jest.fn((cb) => cb(prismaService)),
    };

    auditLogService = {
      log: jest.fn().mockResolvedValue(true),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        EmployeesService,
        { provide: PrismaService, useValue: prismaService },
        { provide: AuditLogService, useValue: auditLogService },
      ],
    }).compile();

    service = module.get<EmployeesService>(EmployeesService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('createEmployee', () => {
    it('should throw ConflictException if employee code already exists', async () => {
      prismaService.employee.findUnique.mockResolvedValueOnce({ id: 'emp-1' });

      await expect(
        service.createEmployee('org-1', {
          employeeCode: 'EMP-001',
          firstName: 'John',
          lastName: 'Doe',
          email: 'john@test.com',
          hireDate: '2026-01-01',
        }),
      ).rejects.toThrow(ConflictException);
    });

    it('should create employee and log HIRE timeline event', async () => {
      prismaService.employee.findUnique.mockResolvedValue(null);
      prismaService.employee.create.mockResolvedValue({
        id: 'emp-100',
        employeeCode: 'EMP-100',
        firstName: 'Jane',
        lastName: 'Smith',
        email: 'jane@test.com',
      });

      const res = await service.createEmployee('org-1', {
        employeeCode: 'EMP-100',
        firstName: 'Jane',
        lastName: 'Smith',
        email: 'jane@test.com',
        hireDate: '2026-01-01',
      });

      expect(res.id).toBe('emp-100');
      expect(prismaService.employeeHistory.create).toHaveBeenCalled();
    });
  });

  describe('getEmployeeById (Cross-Tenant Security)', () => {
    it('should throw ForbiddenException if employee belongs to another organization', async () => {
      prismaService.employee.findFirst.mockResolvedValue(null);

      await expect(service.getEmployeeById('org-1', 'emp-from-org-2')).rejects.toThrow(
        ForbiddenException,
      );

      expect(prismaService.employee.findFirst).toHaveBeenCalledWith({
        where: { id: 'emp-from-org-2', organizationId: 'org-1' },
        include: expect.any(Object),
      });
    });
  });

  describe('updateStatus', () => {
    it('should update status and record status history Rationale', async () => {
      prismaService.employee.findFirst.mockResolvedValue({
        id: 'emp-1',
        organizationId: 'org-1',
        status: EmployeeStatus.PROBATION,
      });

      prismaService.employee.update.mockResolvedValue({
        id: 'emp-1',
        status: EmployeeStatus.ACTIVE,
        confirmationDate: new Date(),
      });

      const res = await service.updateStatus('org-1', 'emp-1', {
        status: EmployeeStatus.ACTIVE,
        reason: 'Successfully completed 3-month probation',
      });

      expect(res.status).toBe(EmployeeStatus.ACTIVE);
      expect(prismaService.employeeStatusHistory.create).toHaveBeenCalledWith({
        data: expect.objectContaining({
          previousStatus: EmployeeStatus.PROBATION,
          newStatus: EmployeeStatus.ACTIVE,
          reason: 'Successfully completed 3-month probation',
        }),
      });
    });
  });
});
