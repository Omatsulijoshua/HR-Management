import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { UpdateProfileDto } from './dto/ess.dto';

@Injectable()
export class EssService {
  constructor(private readonly prisma: PrismaService) {}

  async getMyProfile(tenantId: string, employeeId: string) {
    const employee = await this.prisma.employee.findFirst({
      where: { id: employeeId, organizationId: tenantId },
      include: {
        department: true,
        position: true,
        jobGrade: true,
        branch: true,
        manager: true,
      },
    });

    if (!employee) {
      throw new NotFoundException(`Employee profile with ID ${employeeId} not found`);
    }

    return employee;
  }

  async updateMyProfile(tenantId: string, employeeId: string, dto: UpdateProfileDto) {
    await this.getMyProfile(tenantId, employeeId);

    return this.prisma.employee.update({
      where: { id: employeeId },
      data: {
        ...(dto.phone && { phone: dto.phone }),
        ...(dto.address && { address: dto.address }),
        ...(dto.bankName && { bankName: dto.bankName }),
        ...(dto.accountNumber && { accountNumber: dto.accountNumber }),
        ...(dto.taxId && { taxId: dto.taxId }),
        ...(dto.rsaNumber && { rsaNumber: dto.rsaNumber }),
      },
    });
  }

  async getMyOverviewSummary(tenantId: string, employeeId: string) {
    const [leaveBalances, recentPayslips, pendingLeaveRequests] = await Promise.all([
      this.prisma.leaveBalance.findMany({
        where: { employeeId, organizationId: tenantId },
        include: { leaveType: true },
      }),
      this.prisma.payrollEntry.findMany({
        where: { employeeId },
        take: 3,
        orderBy: { createdAt: 'desc' },
      }),
      this.prisma.leaveRequest.findMany({
        where: { employeeId, organizationId: tenantId, status: 'PENDING' },
      }),
    ]);

    return {
      leaveBalances,
      recentPayslips,
      pendingLeaveRequestsCount: pendingLeaveRequests.length,
    };
  }
}
