import { Controller, Get, Post, Patch, Body, Param, UseGuards, Req } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { TenantGuard } from '../organizations/guards/tenant.guard';
import { PayrollService } from './payroll.service';
import {
  CreateSalaryComponentDto,
  CreateSalaryStructureDto,
  AssignSalaryStructureDto,
  CreatePayrollPeriodDto,
  ProcessPayrollRunDto,
  UpdatePayrollRunStatusDto,
} from './dto/payroll.dto';

@ApiTags('Payroll')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, TenantGuard)
@Controller('payroll')
export class PayrollController {
  constructor(private readonly payrollService: PayrollService) {}

  @Post('components')
  @ApiOperation({ summary: 'Create a salary component' })
  async createSalaryComponent(@Req() req: any, @Body() dto: CreateSalaryComponentDto) {
    return this.payrollService.createSalaryComponent(req.user.organizationId, dto);
  }

  @Get('components')
  @ApiOperation({ summary: 'Get all salary components' })
  async getSalaryComponents(@Req() req: any) {
    return this.payrollService.getSalaryComponents(req.user.organizationId);
  }

  @Post('structures')
  @ApiOperation({ summary: 'Create a salary structure' })
  async createSalaryStructure(@Req() req: any, @Body() dto: CreateSalaryStructureDto) {
    return this.payrollService.createSalaryStructure(req.user.organizationId, dto);
  }

  @Get('structures')
  @ApiOperation({ summary: 'Get all salary structures' })
  async getSalaryStructures(@Req() req: any) {
    return this.payrollService.getSalaryStructures(req.user.organizationId);
  }

  @Post('assignments')
  @ApiOperation({ summary: 'Assign salary structure to employee' })
  async assignSalaryStructure(@Req() req: any, @Body() dto: AssignSalaryStructureDto) {
    return this.payrollService.assignSalaryStructure(req.user.organizationId, dto);
  }

  @Post('periods')
  @ApiOperation({ summary: 'Create a payroll period' })
  async createPayrollPeriod(@Req() req: any, @Body() dto: CreatePayrollPeriodDto) {
    return this.payrollService.createPayrollPeriod(req.user.organizationId, dto);
  }

  @Get('periods')
  @ApiOperation({ summary: 'Get all payroll periods' })
  async getPayrollPeriods(@Req() req: any) {
    return this.payrollService.getPayrollPeriods(req.user.organizationId);
  }

  @Post('runs/process')
  @ApiOperation({ summary: 'Process payroll run for a period' })
  async processPayrollRun(@Req() req: any, @Body() dto: ProcessPayrollRunDto) {
    return this.payrollService.processPayrollRun(req.user.organizationId, dto);
  }

  @Patch('runs/:id/status')
  @ApiOperation({ summary: 'Update payroll run status (Approve / Disburse)' })
  async updatePayrollRunStatus(@Req() req: any, @Param('id') runId: string, @Body() dto: UpdatePayrollRunStatusDto) {
    return this.payrollService.updatePayrollRunStatus(req.user.organizationId, runId, dto);
  }

  @Get('runs/:id')
  @ApiOperation({ summary: 'Get payroll run details and entries' })
  async getPayrollRunDetails(@Req() req: any, @Param('id') runId: string) {
    return this.payrollService.getPayrollRunDetails(req.user.organizationId, runId);
  }

  @Get('my-payslips')
  @ApiOperation({ summary: 'Get employee payslips' })
  async getEmployeePayslips(@Req() req: any) {
    const employeeId = req.user.employeeId || req.user.id;
    return this.payrollService.getEmployeePayslips(req.user.organizationId, employeeId);
  }

  @Get('payslips/:id')
  @ApiOperation({ summary: 'Get itemized payslip details' })
  async getPayslipDetails(@Req() req: any, @Param('id') entryId: string) {
    return this.payrollService.getPayslipDetails(req.user.organizationId, entryId);
  }
}
