import {
  Injectable,
  BadRequestException,
  NotFoundException,
  ForbiddenException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { AuditLogService } from '../audit/audit.service';
import {
  ClockInDto,
  ClockOutDto,
  RequestCorrectionDto,
  ReviewCorrectionDto,
  QueryAttendanceDto,
} from './dto/attendance.dto';
import { AttendanceStatus, CorrectionStatus } from '@prisma/client';

@Injectable()
export class AttendanceService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly auditLogService: AuditLogService,
  ) {}

  async clockIn(
    organizationId: string,
    userId: string,
    dto: ClockInDto,
    ipAddress?: string,
    userAgent?: string,
  ) {
    const employee = await this.prisma.employee.findFirst({
      where: { userId, organizationId },
    });
    if (!employee) {
      throw new BadRequestException('User is not associated with an employee profile in this organization');
    }

    const todayStart = new Date();
    todayStart.setHours(0, 0, 0, 0);

    const existingRecord = await this.prisma.attendanceRecord.findFirst({
      where: {
        employeeId: employee.id,
        date: todayStart,
      },
    });

    if (existingRecord && existingRecord.clockIn) {
      throw new BadRequestException('Already clocked in for today');
    }

    const now = new Date();
    const isLate = now.getHours() >= 9;

    const record = await this.prisma.attendanceRecord.create({
      data: {
        organizationId,
        employeeId: employee.id,
        date: todayStart,
        clockIn: now,
        status: isLate ? AttendanceStatus.LATE : AttendanceStatus.PRESENT,
        ipAddress: ipAddress || null,
        userAgent: userAgent || null,
        latitude: dto.latitude || null,
        longitude: dto.longitude || null,
        notes: dto.notes || null,
      },
    });

    await this.auditLogService.log({
      organizationId,
      userId,
      action: 'CLOCK_IN',
      entity: 'AttendanceRecord',
      entityId: record.id,
      ipAddress,
      userAgent,
    });

    return record;
  }

  async clockOut(
    organizationId: string,
    userId: string,
    dto: ClockOutDto,
  ) {
    const employee = await this.prisma.employee.findFirst({
      where: { userId, organizationId },
    });
    if (!employee) throw new BadRequestException('Employee profile not found');

    const todayStart = new Date();
    todayStart.setHours(0, 0, 0, 0);

    const record = await this.prisma.attendanceRecord.findFirst({
      where: {
        employeeId: employee.id,
        date: todayStart,
      },
    });

    if (!record || !record.clockIn) {
      throw new BadRequestException('No active clock-in record found for today');
    }
    if (record.clockOut) {
      throw new BadRequestException('Already clocked out for today');
    }

    const now = new Date();
    const diffMs = now.getTime() - record.clockIn.getTime();
    const totalHours = Math.round((diffMs / (1000 * 60 * 60)) * 100) / 100;

    const updated = await this.prisma.attendanceRecord.update({
      where: { id: record.id },
      data: {
        clockOut: now,
        totalHours,
        notes: dto.notes ? `${record.notes || ''} | Out: ${dto.notes}` : record.notes,
      },
    });

    return updated;
  }

  async getRecords(organizationId: string, query: QueryAttendanceDto) {
    const where: any = { organizationId };

    if (query.employeeId) where.employeeId = query.employeeId;
    if (query.startDate || query.endDate) {
      where.date = {};
      if (query.startDate) where.date.gte = new Date(query.startDate);
      if (query.endDate) where.date.lte = new Date(query.endDate);
    }

    return this.prisma.attendanceRecord.findMany({
      where,
      orderBy: { date: 'desc' },
      include: {
        employee: {
          select: {
            id: true,
            employeeCode: true,
            firstName: true,
            lastName: true,
            department: { select: { name: true } },
          },
        },
      },
    });
  }

  async requestCorrection(organizationId: string, userId: string, dto: RequestCorrectionDto) {
    const employee = await this.prisma.employee.findFirst({
      where: { userId, organizationId },
    });
    if (!employee) throw new BadRequestException('Employee profile not found');

    return this.prisma.attendanceCorrection.create({
      data: {
        organizationId,
        employeeId: employee.id,
        attendanceRecordId: dto.attendanceRecordId || null,
        requestedClockIn: new Date(dto.requestedClockIn),
        requestedClockOut: new Date(dto.requestedClockOut),
        reason: dto.reason,
        status: CorrectionStatus.PENDING,
      },
    });
  }

  async getCorrections(organizationId: string) {
    return this.prisma.attendanceCorrection.findMany({
      where: { organizationId },
      orderBy: { createdAt: 'desc' },
      include: {
        employee: {
          select: { id: true, firstName: true, lastName: true, employeeCode: true },
        },
      },
    });
  }

  async reviewCorrection(
    organizationId: string,
    correctionId: string,
    reviewerUserId: string,
    dto: ReviewCorrectionDto,
  ) {
    const correction = await this.prisma.attendanceCorrection.findFirst({
      where: { id: correctionId, organizationId },
    });
    if (!correction) throw new NotFoundException('Correction request not found');

    const result = await this.prisma.$transaction(async (tx) => {
      const updatedCorrection = await tx.attendanceCorrection.update({
        where: { id: correctionId },
        data: {
          status: dto.status === 'APPROVED' ? CorrectionStatus.APPROVED : CorrectionStatus.REJECTED,
          reviewedByUserId: reviewerUserId,
          reviewNotes: dto.reviewNotes || null,
        },
      });

      if (dto.status === 'APPROVED') {
        const diffMs =
          new Date(correction.requestedClockOut).getTime() -
          new Date(correction.requestedClockIn).getTime();
        const totalHours = Math.round((diffMs / (1000 * 60 * 60)) * 100) / 100;
        const dateOnly = new Date(correction.requestedClockIn);
        dateOnly.setHours(0, 0, 0, 0);

        if (correction.attendanceRecordId) {
          await tx.attendanceRecord.update({
            where: { id: correction.attendanceRecordId },
            data: {
              clockIn: correction.requestedClockIn,
              clockOut: correction.requestedClockOut,
              totalHours,
              status: AttendanceStatus.PRESENT,
            },
          });
        } else {
          await tx.attendanceRecord.create({
            data: {
              organizationId,
              employeeId: correction.employeeId,
              date: dateOnly,
              clockIn: correction.requestedClockIn,
              clockOut: correction.requestedClockOut,
              totalHours,
              status: AttendanceStatus.PRESENT,
              notes: 'Created via approved attendance correction',
            },
          });
        }
      }

      return updatedCorrection;
    });

    return result;
  }
}
