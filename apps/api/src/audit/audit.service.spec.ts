import { Test, TestingModule } from '@nestjs/testing';
import { AuditLogService } from './audit.service';
import { PrismaService } from '../prisma/prisma.service';

describe('AuditLogService', () => {
  let service: AuditLogService;
  let prisma: PrismaService;

  const mockPrismaService = {
    auditLog: {
      create: jest.fn(),
      findMany: jest.fn(),
    },
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuditLogService,
        { provide: PrismaService, useValue: mockPrismaService },
      ],
    }).compile();

    service = module.get<AuditLogService>(AuditLogService);
    prisma = module.get<PrismaService>(PrismaService);

    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('log', () => {
    it('should create audit log entry', async () => {
      mockPrismaService.auditLog.create.mockResolvedValue({
        id: 'audit-1',
        action: 'UPDATE_SALARY',
        entity: 'Employee',
      });

      const res = await service.log({
        organizationId: 'org-1',
        userId: 'usr-1',
        action: 'UPDATE_SALARY',
        entity: 'Employee',
      });

      expect(res.action).toBe('UPDATE_SALARY');
      expect(prisma.auditLog.create).toHaveBeenCalled();
    });
  });

  describe('getOrganizationLogs', () => {
    it('should return audit log list for organization', async () => {
      mockPrismaService.auditLog.findMany.mockResolvedValue([
        {
          id: 'audit-1',
          action: 'LOGIN_SUCCESS',
          entity: 'User',
          user: { email: 'admin@company.com' },
        },
      ]);

      const res = await service.getOrganizationLogs('org-1');

      expect(res).toHaveLength(1);
      expect(res[0].action).toBe('LOGIN_SUCCESS');
    });
  });
});
