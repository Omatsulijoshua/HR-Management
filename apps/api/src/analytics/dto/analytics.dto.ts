import { IsEnum, IsOptional, IsString, IsDateString } from 'class-validator';

export enum ReportType {
  HEADCOUNT = 'HEADCOUNT',
  PAYROLL_SUMMARY = 'PAYROLL_SUMMARY',
  ATTENDANCE_SUMMARY = 'ATTENDANCE_SUMMARY',
  TURNOVER = 'TURNOVER',
  TRAINING_COMPLETION = 'TRAINING_COMPLETION',
  EXPENSE_SUMMARY = 'EXPENSE_SUMMARY',
}

export class GenerateReportDto {
  @IsEnum(ReportType)
  reportType: ReportType;

  @IsOptional()
  @IsString()
  departmentId?: string;

  @IsOptional()
  @IsDateString()
  startDate?: string;

  @IsOptional()
  @IsDateString()
  endDate?: string;
}
