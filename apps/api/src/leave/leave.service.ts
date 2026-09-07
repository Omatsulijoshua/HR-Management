import {
  Injectable,
  BadRequestException,
  NotFoundException,
  ForbiddenException,
  ConflictException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { AuditLogService } from '../audit/audit.service';
import {
  CreateLeaveTypeDto,
  CreateLeavePolicyDto,
  CreateLeaveRequestDto,
  ReviewLeaveRequestDto,
  QueryLeaveRequestsDto,
} from './dto/leave.dto';
import { LeaveRequestStatus } from '@prisma/client';

@Injectable()
export class LeaveService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly auditLogService: AuditLogService,
  ) {}

  // Leave Types
  async getLeaveTypes(organizationId: string) {
    return this.prisma.leaveType.findMany({
      where: { organizationId },
      orderBy: { name: 'asc' },
    });
  }

  async createLeaveType(organizationId: string, dto: CreateLeaveTypeDto) {
    const existing = await this.prisma.leaveType.findUnique({
      where: { organizationId_code: { organizationId, code: dto.code } },
    });
    if (existing) throw new ConflictException('Leave type code already exists');

    return this.prisma.leaveType.create({
      data: { ...dto, organizationId },
    });
  }

  // Leave Policies
  async getLeavePolicies(organizationId: string) {
    return this.prisma.leavePolicy.findMany({
      where: { organizationId },
      include: { leaveType: true, employmentType: true },
    });
  }

  async createLeavePolicy(organizationId: string, dto: CreateLeavePolicyDto) {
    return this.prisma.leavePolicy.create({
      data: { ...dto, organizationId },
    });
  }

  // Employee Balances
  async getEmployeeBalances(organizationId: string, userId: string, year = new Date().getFullYear()) {
    const employee = await this.prisma.employee.findFirst({
      where: { userId, organizationId },
    });
    if (!employee) throw new BadRequestException('Employee profile not found');

    const leaveTypes = await this.prisma.leaveType.findMany({ where: { organizationId } });

    for (const lt of leaveTypes) {
      await this.prisma.leaveBalance.upsert({
        where: {
          employeeId_leaveTypeId_year: {
            employeeId: employee.id,
            leaveTypeId: lt.id,
            year,
          },
        },
        update: {},
        create: {
          organizationId,
          employeeId: employee.id,
          leaveTypeId: lt.id,
          year,
          totalDays: lt.defaultDays,
          usedDays: 0,
          pendingDays: 0,
          remainingDays: lt.defaultDays,
        },
      });
    }

    return this.prisma.leaveBalance.findMany({
      where: { employeeId: employee.id, year },
      include: { leaveType: true },
    });
  }

  // Leave Requests
  async requestLeave(organizationId: string, userId: string, dto: CreateLeaveRequestDto) {
    const employee = await this.prisma.employee.findFirst({
      where: { userId, organizationId },
    });
    if (!employee) throw new BadRequestException('Employee profile not found');

    const year = new Date(dto.startDate).getFullYear();

    const balance = await this.prisma.leaveBalance.findUnique({
      where: {
        employeeId_leaveTypeId_year: {
          employeeId: employee.id,
          leaveTypeId: dto.leaveTypeId,
          year,
        },
      },
    });

    if (balance && balance.remainingDays < dto.totalDays) {
      throw new BadRequestException(
        `Insufficient leave balance. Remaining: ${balance.remainingDays} days, Requested: ${dto.totalDays} days.`,
      );
    }

    const request = await this.prisma.$transaction(async (tx) => {
      const req = await tx.leaveRequest.create({
        data: {
          organizationId,
          employeeId: employee.id,
          leaveTypeId: dto.leaveTypeId,
          startDate: new Date(dto.startDate),
          endDate: new Date(dto.endDate),
          totalDays: dto.totalDays,
          reason: dto.reason,
          status: LeaveRequestStatus.PENDING,
        },
      });

      if (balance) {
        await tx.leaveBalance.update({
          where: { id: balance.id },
          data: {
            pendingDays: balance.pendingDays + dto.totalDays,
          },
        });
      }

      return req;
    });

    await this.auditLogService.log({
      organizationId,
      userId,
      action: 'LEAVE_REQUESTED',
      entity: 'LeaveRequest',
      entityId: request.id,
    });

    return request;
  }

  async getLeaveRequests(organizationId: string, query: QueryLeaveRequestsDto) {
    const where: any = { organizationId };

    if (query.employeeId) where.employeeId = query.employeeId;
    if (query.status) where.status = query.status;

    return this.prisma.leaveRequest.findMany({
      where,
      orderBy: { createdAt: 'desc' },
      include: {
        employee: { select: { id: true, firstName: true, lastName: true, employeeCode: true } },
        leaveType: { select: { id: true, name: true, code: true, colorCode: true } },
      },
    });
  }

  async reviewLeaveRequest(
    organizationId: string,
    requestId: string,
    reviewerUserId: string,
    dto: ReviewLeaveRequestDto,
  ) {
    const request = await this.prisma.leaveRequest.findFirst({
      where: { id: requestId, organizationId },
    });
    if (!request) throw new NotFoundException('Leave request not found');

    if (request.status !== LeaveRequestStatus.PENDING) {
      throw new BadRequestException('Leave request is already processed');
    }

    const year = request.startDate.getFullYear();

    const result = await this.prisma.$transaction(async (tx) => {
      const newStatus =
        dto.status === 'APPROVED' ? LeaveRequestStatus.APPROVED : LeaveRequestStatus.REJECTED;

      const updated = await tx.leaveRequest.update({
        where: { id: requestId },
        data: {
          status: newStatus,
          reviewedByUserId: reviewerUserId,
          reviewNotes: dto.reviewNotes || null,
        },
      });

      const balance = await tx.leaveBalance.findUnique({
        where: {
          employeeId_leaveTypeId_year: {
            employeeId: request.employeeId,
            leaveTypeId: request.leaveTypeId,
            year,
          },
        },
      });

      if (balance) {
        if (newStatus === LeaveRequestStatus.APPROVED) {
          const usedDays = balance.usedDays + request.totalDays;
          const pendingDays = Math.max(0, balance.pendingDays - request.totalDays);
          const remainingDays = balance.totalDays - usedDays;

          await tx.leaveBalance.update({
            where: { id: balance.id },
            data: { usedDays, pendingDays, remainingDays },
          });
        } else {
          const pendingDays = Math.max(0, balance.pendingDays - request.totalDays);
          await tx.leaveBalance.update({
            where: { id: balance.id },
            data: { pendingDays },
          });
        }
      }

      return updated;
    });

    return result;
  }

  async getLeaveCalendar(organizationId: string) {
    return this.prisma.leaveRequest.findMany({
      where: {
        organizationId,
        status: LeaveRequestStatus.APPROVED,
      },
      include: {
        employee: { select: { id: true, firstName: true, lastName: true } },
        leaveType: { select: { name: true, colorCode: true } },
      },
      orderBy: { startDate: 'asc' },
    });
  }
}
