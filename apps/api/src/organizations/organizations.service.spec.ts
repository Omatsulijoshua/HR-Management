import { Test, TestingModule } from '@nestjs/testing';
import { ForbiddenException, NotFoundException } from '@nestjs/common';
import { OrganizationsService } from './organizations.service';
import { PrismaService } from '../prisma/prisma.service';

describe('OrganizationsService (Phase 3 Multi-Tenancy)', () => {
  let service: OrganizationsService;
  let prismaService: any;

  beforeEach(async () => {
    prismaService = {
      organization: {
        findUnique: jest.fn(),
        update: jest.fn(),
      },
      branch: {
        findMany: jest.fn(),
        findUnique: jest.fn(),
        findFirst: jest.fn(),
        create: jest.fn(),
        delete: jest.fn(),
      },
      department: {
        findMany: jest.fn(),
        findUnique: jest.fn(),
        findFirst: jest.fn(),
        create: jest.fn(),
        delete: jest.fn(),
      },
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        OrganizationsService,
        { provide: PrismaService, useValue: prismaService },
      ],
    }).compile();

    service = module.get<OrganizationsService>(OrganizationsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('getOrganization', () => {
    it('should return organization profile if found', async () => {
      prismaService.organization.findUnique.mockResolvedValue({
        id: 'org-1',
        name: 'Acme Corp',
      });

      const res = await service.getOrganization('org-1');
      expect(res.name).toBe('Acme Corp');
    });

    it('should throw NotFoundException if organization not found', async () => {
      prismaService.organization.findUnique.mockResolvedValue(null);
      await expect(service.getOrganization('invalid-id')).rejects.toThrow(NotFoundException);
    });
  });

  describe('deleteDepartment (Cross-Tenant Security)', () => {
    it('should throw ForbiddenException if user from Org A tries to delete Org B department', async () => {
      // department belongs to org-2
      prismaService.department.findFirst.mockResolvedValue(null);

      await expect(
        service.deleteDepartment('org-1', 'dept-from-org-2'),
      ).rejects.toThrow(ForbiddenException);

      expect(prismaService.department.findFirst).toHaveBeenCalledWith({
        where: { id: 'dept-from-org-2', organizationId: 'org-1' },
      });
    });

    it('should delete department successfully when organizationId matches', async () => {
      prismaService.department.findFirst.mockResolvedValue({
        id: 'dept-1',
        organizationId: 'org-1',
      });
      prismaService.department.delete.mockResolvedValue({ id: 'dept-1' });

      const res = await service.deleteDepartment('org-1', 'dept-1');
      expect(res.id).toBe('dept-1');
    });
  });
});
