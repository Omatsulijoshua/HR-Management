import { Test, TestingModule } from '@nestjs/testing';
import { TrainingService } from './training.service';
import { PrismaService } from '../prisma/prisma.service';
import { CourseType, TrainingEnrollmentStatus } from '@prisma/client';
import { BadRequestException, NotFoundException } from '@nestjs/common';

describe('TrainingService', () => {
  let service: TrainingService;
  let prisma: PrismaService;

  const mockOrgId = 'org-uuid-1';
  const mockEmployeeId = 'emp-uuid-1';
  const mockCourseId = 'course-uuid-1';

  const mockPrismaService = {
    trainingCourse: {
      findUnique: jest.fn(),
      create: jest.fn(),
      findMany: jest.fn(),
      findFirst: jest.fn(),
    },
    employee: {
      findFirst: jest.fn(),
    },
    trainingEnrollment: {
      create: jest.fn(),
      update: jest.fn(),
      findFirst: jest.fn(),
      findMany: jest.fn(),
    },
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        TrainingService,
        {
          provide: PrismaService,
          useValue: mockPrismaService,
        },
      ],
    }).compile();

    service = module.get<TrainingService>(TrainingService);
    prisma = module.get<PrismaService>(PrismaService);
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('createCourse', () => {
    it('should create a training course', async () => {
      mockPrismaService.trainingCourse.findUnique.mockResolvedValue(null);
      mockPrismaService.trainingCourse.create.mockResolvedValue({
        id: mockCourseId,
        organizationId: mockOrgId,
        title: 'Microservices Security Architecture',
        code: 'SEC_101',
        type: CourseType.INTERNAL_WORKSHOP,
        capacity: 25,
      });

      const res = await service.createCourse(mockOrgId, {
        title: 'Microservices Security Architecture',
        code: 'SEC_101',
        type: CourseType.INTERNAL_WORKSHOP,
        capacity: 25,
      });

      expect(res.title).toBe('Microservices Security Architecture');
      expect(mockPrismaService.trainingCourse.create).toHaveBeenCalled();
    });
  });

  describe('enrollEmployee', () => {
    it('should enroll an employee if course capacity permits', async () => {
      mockPrismaService.trainingCourse.findFirst.mockResolvedValue({
        id: mockCourseId,
        capacity: 25,
        enrollments: [],
      });
      mockPrismaService.employee.findFirst.mockResolvedValue({ id: mockEmployeeId });
      mockPrismaService.trainingEnrollment.create.mockResolvedValue({
        id: 'enr-1',
        courseId: mockCourseId,
        employeeId: mockEmployeeId,
        status: TrainingEnrollmentStatus.ENROLLED,
      });

      const res = await service.enrollEmployee(mockOrgId, {
        courseId: mockCourseId,
        employeeId: mockEmployeeId,
      });

      expect(res.status).toBe(TrainingEnrollmentStatus.ENROLLED);
    });

    it('should throw BadRequestException if course capacity is full', async () => {
      mockPrismaService.trainingCourse.findFirst.mockResolvedValue({
        id: mockCourseId,
        capacity: 2,
        enrollments: [{ id: 'e1' }, { id: 'e2' }],
      });

      await expect(
        service.enrollEmployee(mockOrgId, {
          courseId: mockCourseId,
          employeeId: mockEmployeeId,
        }),
      ).rejects.toThrow(BadRequestException);
    });
  });
});
