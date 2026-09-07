import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateDelegationDto, ScheduleOneOnOneDto } from './dto/mss.dto';

@Injectable()
export class MssService {
  constructor(private readonly prisma: PrismaService) {}

  async getMyTeam(tenantId: string, managerId: string) {
    return this.prisma.employee.findMany({
      where: { managerId, organizationId: tenantId },
      include: {
        department: true,
        position: true,
        jobGrade: true,
      },
    });
  }

  async createDelegation(tenantId: string, managerId: string, dto: CreateDelegationDto) {
    return this.prisma.managerDelegation.create({
      data: {
        organizationId: tenantId,
        managerId,
        delegateId: dto.delegateId,
        startDate: new Date(dto.startDate),
        endDate: new Date(dto.endDate),
        reason: dto.reason,
        status: 'ACTIVE',
      },
      include: {
        delegate: true,
      },
    });
  }

  async scheduleOneOnOne(tenantId: string, managerId: string, dto: ScheduleOneOnOneDto) {
    return this.prisma.oneOnOneMeeting.create({
      data: {
        organizationId: tenantId,
        managerId,
        employeeId: dto.employeeId,
        title: dto.title,
        scheduledAt: new Date(dto.scheduledAt),
        agenda: dto.agenda,
        status: 'SCHEDULED',
      },
      include: {
        employee: true,
      },
    });
  }

  async getManagerDashboardSummary(tenantId: string, managerId: string) {
    const directReports = await this.getMyTeam(tenantId, managerId);
    const directReportIds = directReports.map((r) => r.id);

    const [pendingLeaveRequests, pendingOvertime, delegations, upcomingMeetings] = await Promise.all([
      this.prisma.leaveRequest.findMany({
        where: {
          organizationId: tenantId,
          employeeId: { in: directReportIds },
          status: 'PENDING',
        },
        include: { employee: true, leaveType: true },
      }),
      this.prisma.overtimeRecord.findMany({
        where: {
          organizationId: tenantId,
          employeeId: { in: directReportIds },
          isApproved: false,
        },
        include: { employee: true },
      }),
      this.prisma.managerDelegation.findMany({
        where: { organizationId: tenantId, managerId, status: 'ACTIVE' },
        include: { delegate: true },
      }),
      this.prisma.oneOnOneMeeting.findMany({
        where: { organizationId: tenantId, managerId, status: 'SCHEDULED' },
        include: { employee: true },
        orderBy: { scheduledAt: 'asc' },
      }),
    ]);

    return {
      teamCount: directReports.length,
      pendingApprovalsCount: pendingLeaveRequests.length + pendingOvertime.length,
      pendingLeaveRequests,
      pendingOvertime,
      delegations,
      upcomingMeetings,
    };
  }
}
