import { Injectable, NotFoundException, BadRequestException, ConflictException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import {
  CreateSalaryComponentDto,
  CreateSalaryStructureDto,
  AssignSalaryStructureDto,
  CreatePayrollPeriodDto,
  ProcessPayrollRunDto,
  UpdatePayrollRunStatusDto,
} from './dto/payroll.dto';
import { PayrollRunStatus, SalaryComponentType, CalculationType } from '@prisma/client';

@Injectable()
export class PayrollService {
  constructor(private readonly prisma: PrismaService) {}

  // 1. Salary Components
  async createSalaryComponent(organizationId: string, dto: CreateSalaryComponentDto) {
    const existing = await this.prisma.salaryComponent.findUnique({
      where: {
        organizationId_code: {
          organizationId,
          code: dto.code,
        },
      },
    });

    if (existing) {
      throw new ConflictException(`Salary component with code ${dto.code} already exists`);
    }

    return this.prisma.salaryComponent.create({
      data: {
        organizationId,
        name: dto.name,
        code: dto.code,
        type: dto.type,
        calculationType: dto.calculationType ?? CalculationType.FIXED,
        defaultAmount: dto.defaultAmount ?? 0,
        percentageValue: dto.percentageValue ?? 0,
        isTaxable: dto.isTaxable ?? true,
        isStatutory: dto.isStatutory ?? false,
      },
    });
  }

  async getSalaryComponents(organizationId: string) {
    return this.prisma.salaryComponent.findMany({
      where: { organizationId },
      orderBy: { createdAt: 'desc' },
    });
  }

  // 2. Salary Structures
  async createSalaryStructure(organizationId: string, dto: CreateSalaryStructureDto) {
    const existing = await this.prisma.salaryStructure.findUnique({
      where: {
        organizationId_code: {
          organizationId,
          code: dto.code,
        },
      },
    });

    if (existing) {
      throw new ConflictException(`Salary structure with code ${dto.code} already exists`);
    }

    return this.prisma.salaryStructure.create({
      data: {
        organizationId,
        name: dto.name,
        code: dto.code,
        description: dto.description,
        components: {
          create: dto.components.map((c) => ({
            salaryComponentId: c.salaryComponentId,
            amount: c.amount ?? 0,
          })),
        },
      },
      include: {
        components: {
          include: {
            salaryComponent: true,
          },
        },
      },
    });
  }

  async getSalaryStructures(organizationId: string) {
    return this.prisma.salaryStructure.findMany({
      where: { organizationId },
      include: {
        components: {
          include: {
            salaryComponent: true,
          },
        },
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  // 3. Employee Salary Assignment
  async assignSalaryStructure(organizationId: string, dto: AssignSalaryStructureDto) {
    const employee = await this.prisma.employee.findFirst({
      where: { id: dto.employeeId, organizationId },
    });

    if (!employee) {
      throw new NotFoundException('Employee not found in this organization');
    }

    const structure = await this.prisma.salaryStructure.findFirst({
      where: { id: dto.salaryStructureId, organizationId },
    });

    if (!structure) {
      throw new NotFoundException('Salary structure not found in this organization');
    }

    // Deactivate prior assignments
    await this.prisma.employeeSalaryAssignment.updateMany({
      where: { employeeId: dto.employeeId, isActive: true },
      data: { isActive: false, effectiveTo: new Date() },
    });

    // Also update basic salary on employee model
    await this.prisma.employee.update({
      where: { id: dto.employeeId },
      data: { basicSalary: dto.baseSalary },
    });

    return this.prisma.employeeSalaryAssignment.create({
      data: {
        employeeId: dto.employeeId,
        salaryStructureId: dto.salaryStructureId,
        effectiveFrom: new Date(dto.effectiveFrom),
        effectiveTo: dto.effectiveTo ? new Date(dto.effectiveTo) : null,
        baseSalary: dto.baseSalary,
        isActive: true,
      },
      include: {
        salaryStructure: {
          include: {
            components: {
              include: {
                salaryComponent: true,
              },
            },
          },
        },
      },
    });
  }

  // 4. Payroll Period Management
  async createPayrollPeriod(organizationId: string, dto: CreatePayrollPeriodDto) {
    return this.prisma.payrollPeriod.create({
      data: {
        organizationId,
        name: dto.name,
        frequency: dto.frequency,
        startDate: new Date(dto.startDate),
        endDate: new Date(dto.endDate),
        payDate: new Date(dto.payDate),
      },
    });
  }

  async getPayrollPeriods(organizationId: string) {
    return this.prisma.payrollPeriod.findMany({
      where: { organizationId },
      include: {
        payrollRuns: true,
      },
      orderBy: { startDate: 'desc' },
    });
  }

  // 5. Payroll Run Engine
  async processPayrollRun(organizationId: string, dto: ProcessPayrollRunDto) {
    const period = await this.prisma.payrollPeriod.findFirst({
      where: { id: dto.periodId, organizationId },
    });

    if (!period) {
      throw new NotFoundException('Payroll period not found');
    }

    const existingRun = await this.prisma.payrollRun.findFirst({
      where: { organizationId, periodId: dto.periodId },
    });

    if (existingRun && (existingRun.status === PayrollRunStatus.APPROVED || existingRun.status === PayrollRunStatus.DISBURSED)) {
      throw new BadRequestException('Payroll run for this period has already been approved or disbursed');
    }

    // Delete previous draft run if present
    if (existingRun) {
      await this.prisma.payrollRun.delete({ where: { id: existingRun.id } });
    }

    // Fetch active employees
    const employees = await this.prisma.employee.findMany({
      where: { organizationId, status: { in: ['ACTIVE', 'PROBATION'] } },
      include: {
        salaryAssignments: {
          where: { isActive: true },
          include: {
            salaryStructure: {
              include: {
                components: {
                  include: { salaryComponent: true },
                },
              },
            },
          },
        },
      },
    });

    if (employees.length === 0) {
      throw new BadRequestException('No active employees found for payroll processing');
    }

    return this.prisma.$transaction(async (tx) => {
      const payrollRun = await tx.payrollRun.create({
        data: {
          organizationId,
          periodId: dto.periodId,
          status: PayrollRunStatus.PROCESSING,
          processedAt: new Date(),
        },
      });

      let totalRunGross = 0;
      let totalRunDeductions = 0;
      let totalRunTax = 0;
      let totalRunPension = 0;
      let totalRunNet = 0;

      for (const emp of employees) {
        const assignment = emp.salaryAssignments[0];
        const basicSalary = assignment ? assignment.baseSalary : emp.basicSalary || 50000;
        let totalAllowances = 0;
        let otherDeductions = 0;
        const lineItems: { componentName: string; type: SalaryComponentType; amount: number }[] = [];

        // Basic Line Item
        lineItems.push({
          componentName: 'Basic Salary',
          type: SalaryComponentType.EARNING,
          amount: basicSalary,
        });

        if (assignment && assignment.salaryStructure) {
          for (const item of assignment.salaryStructure.components) {
            const comp = item.salaryComponent;
            let compAmount = item.amount > 0 ? item.amount : comp.defaultAmount;
            if (comp.calculationType === CalculationType.PERCENTAGE_OF_BASIC && comp.percentageValue) {
              compAmount = (comp.percentageValue / 100) * basicSalary;
            }

            if (comp.type === SalaryComponentType.EARNING) {
              totalAllowances += compAmount;
              lineItems.push({
                componentName: comp.name,
                type: SalaryComponentType.EARNING,
                amount: compAmount,
              });
            } else if (comp.type === SalaryComponentType.DEDUCTION) {
              otherDeductions += compAmount;
              lineItems.push({
                componentName: comp.name,
                type: SalaryComponentType.DEDUCTION,
                amount: compAmount,
              });
            }
          }
        }

        const grossSalary = basicSalary + totalAllowances;

        // Statutory Pension: 8% of Basic Salary
        const pensionDeduction = basicSalary * 0.08;
        lineItems.push({
          componentName: 'Pension (8%)',
          type: SalaryComponentType.DEDUCTION,
          amount: pensionDeduction,
        });

        // Statutory PAYE Tax: 10% of taxable income (Gross - Pension)
        const taxableIncome = Math.max(0, grossSalary - pensionDeduction);
        const taxDeduction = taxableIncome * 0.10;
        lineItems.push({
          componentName: 'PAYE Tax (10%)',
          type: SalaryComponentType.DEDUCTION,
          amount: taxDeduction,
        });

        const totalDeductions = pensionDeduction + taxDeduction + otherDeductions;
        const netPay = grossSalary - totalDeductions;

        totalRunGross += grossSalary;
        totalRunDeductions += totalDeductions;
        totalRunTax += taxDeduction;
        totalRunPension += pensionDeduction;
        totalRunNet += netPay;

        await tx.payrollEntry.create({
          data: {
            payrollRunId: payrollRun.id,
            employeeId: emp.id,
            basicSalary,
            totalAllowances,
            grossSalary,
            taxDeduction,
            pensionDeduction,
            otherDeductions,
            totalDeductions,
            netPay,
            lineItems: {
              create: lineItems,
            },
          },
        });
      }

      return tx.payrollRun.update({
        where: { id: payrollRun.id },
        data: {
          status: PayrollRunStatus.DRAFT,
          totalEmployees: employees.length,
          totalGross: totalRunGross,
          totalDeductions: totalRunDeductions,
          totalTax: totalRunTax,
          totalPension: totalRunPension,
          totalNet: totalRunNet,
        },
        include: {
          period: true,
          entries: {
            include: {
              employee: true,
              lineItems: true,
            },
          },
        },
      });
    });
  }

  // 6. Update Status (Approval / Disbursement)
  async updatePayrollRunStatus(organizationId: string, runId: string, dto: UpdatePayrollRunStatusDto) {
    const run = await this.prisma.payrollRun.findFirst({
      where: { id: runId, organizationId },
    });

    if (!run) {
      throw new NotFoundException('Payroll run not found');
    }

    const updateData: any = { status: dto.status };
    if (dto.status === PayrollRunStatus.APPROVED) {
      updateData.approvedAt = new Date();
    } else if (dto.status === PayrollRunStatus.DISBURSED) {
      updateData.disbursedAt = new Date();
      // Lock period
      await this.prisma.payrollPeriod.update({
        where: { id: run.periodId },
        data: { isClosed: true },
      });
    }

    return this.prisma.payrollRun.update({
      where: { id: runId },
      data: updateData,
      include: {
        period: true,
        entries: {
          include: { employee: true },
        },
      },
    });
  }

  // 7. View Runs & Payslips
  async getPayrollRunDetails(organizationId: string, runId: string) {
    const run = await this.prisma.payrollRun.findFirst({
      where: { id: runId, organizationId },
      include: {
        period: true,
        entries: {
          include: {
            employee: true,
            lineItems: true,
          },
        },
      },
    });

    if (!run) {
      throw new NotFoundException('Payroll run not found');
    }

    return run;
  }

  async getEmployeePayslips(organizationId: string, employeeId: string) {
    return this.prisma.payrollEntry.findMany({
      where: {
        employeeId,
        payrollRun: {
          organizationId,
          status: { in: [PayrollRunStatus.APPROVED, PayrollRunStatus.DISBURSED] },
        },
      },
      include: {
        payrollRun: {
          include: { period: true },
        },
        lineItems: true,
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  async getPayslipDetails(organizationId: string, entryId: string) {
    const entry = await this.prisma.payrollEntry.findFirst({
      where: {
        id: entryId,
        payrollRun: { organizationId },
      },
      include: {
        employee: {
          include: {
            department: true,
            jobGrade: true,
            branch: true,
          },
        },
        payrollRun: {
          include: { period: true },
        },
        lineItems: true,
      },
    });

    if (!entry) {
      throw new NotFoundException('Payslip not found');
    }

    return entry;
  }
}
