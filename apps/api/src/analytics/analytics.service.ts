import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { GenerateReportDto, ReportType } from './dto/analytics.dto';

@Injectable()
export class AnalyticsService {
  constructor(private readonly prisma: PrismaService) {}

  async getExecutiveOverview(organizationId: string) {
    const totalEmployees = await this.prisma.employee.count({
      where: { organizationId, status: 'ACTIVE' },
    });

    const totalDepartments = await this.prisma.department.count({
      where: { organizationId },
    });

    const activeJobPostings = await this.prisma.jobPosting.count({
      where: { organizationId, status: 'PUBLISHED' },
    });

    const activeHseIncidents = await this.prisma.hseIncident.count({
      where: {
        organizationId,
        status: { in: ['REPORTED', 'UNDER_INVESTIGATION'] },
      },
    });

    // Department breakdown
    const departmentBreakdown = await this.prisma.employee.groupBy({
      by: ['departmentId'],
      where: { organizationId, status: 'ACTIVE' },
      _count: { _all: true },
    });

    const departments = await this.prisma.department.findMany({
      where: { organizationId },
      select: { id: true, name: true, code: true },
    });

    const departmentStats = departments.map((dept) => {
      const match = departmentBreakdown.find((b) => b.departmentId === dept.id);
      return {
        departmentId: dept.id,
        departmentName: dept.name,
        code: dept.code,
        employeeCount: match?._count._all || 0,
      };
    });

    // Payroll summary aggregate
    const payrollAgg = await this.prisma.payrollEntry.aggregate({
      where: {
        payrollRun: { organizationId },
      },
      _sum: {
        grossSalary: true,
        netPay: true,
        totalDeductions: true,
      },
      _count: { _all: true },
    });

    const monthlyPayrollSpend = payrollAgg._sum.grossSalary || 0;
    const averageSalary = totalEmployees > 0 ? Math.round(monthlyPayrollSpend / totalEmployees) : 0;

    // Benchmark eNPS index
    const eNPS = 42;

    return {
      kpis: {
        totalHeadcount: totalEmployees,
        monthlyPayrollSpend,
        averageSalary,
        activeJobPostings,
        activeHseIncidents,
        eNPSIndex: eNPS,
        totalDepartments,
      },
      departmentDistribution: departmentStats,
      payrollSummary: {
        totalGross: payrollAgg._sum.grossSalary || 0,
        totalNet: payrollAgg._sum.netPay || 0,
        totalDeductions: payrollAgg._sum.totalDeductions || 0,
        processedEntries: payrollAgg._count._all || 0,
      },
    };
  }

  async generateReport(organizationId: string, dto: GenerateReportDto) {
    const { reportType, departmentId } = dto;

    switch (reportType) {
      case ReportType.HEADCOUNT: {
        const whereClause: any = { organizationId };
        if (departmentId) whereClause.departmentId = departmentId;

        const employees = await this.prisma.employee.findMany({
          where: whereClause,
          include: { department: true, position: true },
          orderBy: { createdAt: 'desc' },
        });

        const headers = ['Employee Code', 'Full Name', 'Email', 'Department', 'Position', 'Status', 'Hire Date'];
        const rows = employees.map((emp) => [
          emp.employeeCode,
          `${emp.firstName} ${emp.lastName}`,
          emp.email,
          emp.department?.name || 'N/A',
          emp.position?.title || 'N/A',
          emp.status,
          emp.hireDate ? new Date(emp.hireDate).toISOString().split('T')[0] : 'N/A',
        ]);

        return {
          reportType,
          totalRecords: rows.length,
          headers,
          rows,
          generatedAt: new Date().toISOString(),
        };
      }

      case ReportType.PAYROLL_SUMMARY: {
        const payrollEntries = await this.prisma.payrollEntry.findMany({
          where: { payrollRun: { organizationId } },
          include: { employee: true },
          take: 100,
        });

        const headers = ['Employee Code', 'Employee Name', 'Basic Salary', 'Gross Pay', 'Total Deductions', 'Net Pay'];
        const rows = payrollEntries.map((pe) => [
          pe.employee?.employeeCode || 'N/A',
          `${pe.employee?.firstName || ''} ${pe.employee?.lastName || ''}`.trim() || 'N/A',
          pe.basicSalary || 0,
          pe.grossSalary || 0,
          pe.totalDeductions || 0,
          pe.netPay || 0,
        ]);

        return {
          reportType,
          totalRecords: rows.length,
          headers,
          rows,
          generatedAt: new Date().toISOString(),
        };
      }

      case ReportType.ATTENDANCE_SUMMARY: {
        const records = await this.prisma.attendanceRecord.findMany({
          where: { organizationId },
          include: { employee: true },
          take: 100,
        });

        const headers = ['Employee Code', 'Name', 'Date', 'Clock In', 'Clock Out', 'Status'];
        const rows = records.map((rec) => [
          rec.employee?.employeeCode || 'N/A',
          `${rec.employee?.firstName} ${rec.employee?.lastName}`,
          new Date(rec.date).toISOString().split('T')[0],
          rec.clockIn ? new Date(rec.clockIn).toLocaleTimeString() : 'N/A',
          rec.clockOut ? new Date(rec.clockOut).toLocaleTimeString() : 'N/A',
          rec.status,
        ]);

        return {
          reportType,
          totalRecords: rows.length,
          headers,
          rows,
          generatedAt: new Date().toISOString(),
        };
      }

      case ReportType.TURNOVER: {
        const statusHistories = await this.prisma.employeeStatusHistory.findMany({
          where: { organizationId, newStatus: 'TERMINATED' },
          include: { employee: true },
          take: 50,
        });

        const headers = ['Employee Code', 'Name', 'Effective Date', 'Reason'];
        const rows = statusHistories.map((sh) => [
          sh.employee?.employeeCode || 'N/A',
          `${sh.employee?.firstName} ${sh.employee?.lastName}`,
          new Date(sh.effectiveDate).toISOString().split('T')[0],
          sh.reason || 'N/A',
        ]);

        return {
          reportType,
          totalRecords: rows.length,
          headers,
          rows,
          generatedAt: new Date().toISOString(),
        };
      }

      case ReportType.TRAINING_COMPLETION: {
        const enrollments = await this.prisma.trainingEnrollment.findMany({
          where: { course: { organizationId } },
          include: { course: true, employee: true },
          take: 100,
        });

        const headers = ['Course Title', 'Employee Code', 'Employee Name', 'Status'];
        const rows = enrollments.map((en) => [
          en.course?.title || 'N/A',
          en.employee?.employeeCode || 'N/A',
          `${en.employee?.firstName} ${en.employee?.lastName}`,
          en.status,
        ]);

        return {
          reportType,
          totalRecords: rows.length,
          headers,
          rows,
          generatedAt: new Date().toISOString(),
        };
      }

      case ReportType.EXPENSE_SUMMARY: {
        const claims = await this.prisma.expenseClaim.findMany({
          where: { organizationId },
          include: { employee: true },
          take: 100,
        });

        const headers = ['Claim Number', 'Employee', 'Title', 'Category', 'Amount', 'Status'];
        const rows = claims.map((c) => [
          c.claimNumber,
          `${c.employee?.firstName} ${c.employee?.lastName}`,
          c.title,
          c.category,
          c.amount,
          c.status,
        ]);

        return {
          reportType,
          totalRecords: rows.length,
          headers,
          rows,
          generatedAt: new Date().toISOString(),
        };
      }

      default:
        return {
          reportType,
          totalRecords: 0,
          headers: [],
          rows: [],
          generatedAt: new Date().toISOString(),
        };
    }
  }
}
