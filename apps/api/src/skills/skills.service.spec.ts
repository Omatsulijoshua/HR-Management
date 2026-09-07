import { Test, TestingModule } from '@nestjs/testing';
import { SkillsService } from './skills.service';
import { PrismaService } from '../prisma/prisma.service';
import { ProficiencyLevel } from '@prisma/client';
import { NotFoundException } from '@nestjs/common';

describe('SkillsService', () => {
  let service: SkillsService;
  let prisma: PrismaService;

  const mockOrgId = 'org-uuid-1';
  const mockEmployeeId = 'emp-uuid-1';
  const mockSkillId = 'skill-uuid-1';

  const mockPrismaService = {
    skill: {
      findUnique: jest.fn(),
      create: jest.fn(),
      findMany: jest.fn(),
      findFirst: jest.fn(),
    },
    employee: {
      findFirst: jest.fn(),
    },
    employeeSkill: {
      upsert: jest.fn(),
    },
    jobPosition: {
      findFirst: jest.fn(),
    },
    skillRequirement: {
      create: jest.fn(),
    },
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        SkillsService,
        {
          provide: PrismaService,
          useValue: mockPrismaService,
        },
      ],
    }).compile();

    service = module.get<SkillsService>(SkillsService);
    prisma = module.get<PrismaService>(PrismaService);
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('createSkill', () => {
    it('should create a skill definition in taxonomy', async () => {
      mockPrismaService.skill.findUnique.mockResolvedValue(null);
      mockPrismaService.skill.create.mockResolvedValue({
        id: mockSkillId,
        organizationId: mockOrgId,
        name: 'TypeScript',
        code: 'TS_LANG',
        category: 'Engineering',
      });

      const res = await service.createSkill(mockOrgId, {
        name: 'TypeScript',
        code: 'TS_LANG',
        category: 'Engineering',
      });

      expect(res.name).toBe('TypeScript');
      expect(mockPrismaService.skill.create).toHaveBeenCalled();
    });
  });

  describe('getSkillGapAnalysis', () => {
    it('should calculate skill gap analysis percentage match correctly', async () => {
      mockPrismaService.employee.findFirst.mockResolvedValue({
        id: mockEmployeeId,
        firstName: 'Omatsuli',
        lastName: 'Joshua',
        position: {
          title: 'Senior Software Architect',
          skillRequirements: [
            {
              skillId: mockSkillId,
              requiredScore: 4.0,
              skill: { name: 'TypeScript' },
            },
          ],
        },
        skills: [
          {
            skillId: mockSkillId,
            ratingScore: 5.0,
            skill: { name: 'TypeScript' },
          },
        ],
      });

      const res = await service.getSkillGapAnalysis(mockOrgId, mockEmployeeId);

      expect(res.overallMatchPercentage).toBe(100);
      expect(res.gaps[0].isQualified).toBe(true);
    });
  });
});
