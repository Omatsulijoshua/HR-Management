import { Injectable, NotFoundException, BadRequestException, ConflictException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import {
  CreateTrainingCourseDto,
  EnrollTrainingDto,
  UpdateEnrollmentStatusDto,
} from './dto/training.dto';
import { TrainingEnrollmentStatus } from '@prisma/client';

@Injectable()
export class TrainingService {
  constructor(private readonly prisma: PrismaService) {}

  async createCourse(organizationId: string, dto: CreateTrainingCourseDto) {
    const existing = await this.prisma.trainingCourse.findUnique({
      where: {
        organizationId_code: {
          organizationId,
          code: dto.code,
        },
      },
    });

    if (existing) {
      throw new ConflictException(`Training course with code ${dto.code} already exists`);
    }

    return this.prisma.trainingCourse.create({
      data: {
        organizationId,
        title: dto.title,
        code: dto.code,
        type: dto.type,
        instructor: dto.instructor,
        description: dto.description,
        durationHours: dto.durationHours ?? 8,
        capacity: dto.capacity ?? 30,
      },
    });
  }

  async getCourses(organizationId: string) {
    return this.prisma.trainingCourse.findMany({
      where: { organizationId },
      include: { enrollments: true },
      orderBy: { createdAt: 'desc' },
    });
  }

  async enrollEmployee(organizationId: string, dto: EnrollTrainingDto) {
    const course = await this.prisma.trainingCourse.findFirst({
      where: { id: dto.courseId, organizationId },
      include: { enrollments: true },
    });

    if (!course) {
      throw new NotFoundException('Training course not found');
    }

    if (course.enrollments.length >= course.capacity) {
      throw new BadRequestException('Training course capacity is full');
    }

    const employee = await this.prisma.employee.findFirst({
      where: { id: dto.employeeId, organizationId },
    });

    if (!employee) {
      throw new NotFoundException('Employee not found');
    }

    return this.prisma.trainingEnrollment.create({
      data: {
        organizationId,
        courseId: dto.courseId,
        employeeId: dto.employeeId,
        status: TrainingEnrollmentStatus.ENROLLED,
      },
      include: {
        course: true,
        employee: true,
      },
    });
  }

  async updateEnrollmentStatus(organizationId: string, enrollmentId: string, dto: UpdateEnrollmentStatusDto) {
    const enrollment = await this.prisma.trainingEnrollment.findFirst({
      where: { id: enrollmentId, organizationId },
    });

    if (!enrollment) {
      throw new NotFoundException('Training enrollment record not found');
    }

    return this.prisma.trainingEnrollment.update({
      where: { id: enrollmentId },
      data: {
        status: dto.status,
        certificateUrl: dto.certificateUrl || enrollment.certificateUrl,
        completionDate: dto.status === TrainingEnrollmentStatus.COMPLETED ? new Date() : enrollment.completionDate,
      },
      include: {
        course: true,
        employee: true,
      },
    });
  }

  async getEnrollments(organizationId: string, employeeId?: string) {
    return this.prisma.trainingEnrollment.findMany({
      where: {
        organizationId,
        ...(employeeId ? { employeeId } : {}),
      },
      include: {
        course: true,
        employee: true,
      },
      orderBy: { createdAt: 'desc' },
    });
  }
}
