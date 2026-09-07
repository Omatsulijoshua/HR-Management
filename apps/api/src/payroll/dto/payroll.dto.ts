import { IsString, IsNotEmpty, IsEnum, IsNumber, IsOptional, IsBoolean, IsArray, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';
import { SalaryComponentType, CalculationType, PayrollFrequency, PayrollRunStatus } from '@prisma/client';

export class CreateSalaryComponentDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsString()
  @IsNotEmpty()
  code: string;

  @IsEnum(SalaryComponentType)
  type: SalaryComponentType;

  @IsEnum(CalculationType)
  @IsOptional()
  calculationType?: CalculationType = CalculationType.FIXED;

  @IsNumber()
  @IsOptional()
  defaultAmount?: number = 0;

  @IsNumber()
  @IsOptional()
  percentageValue?: number;

  @IsBoolean()
  @IsOptional()
  isTaxable?: boolean = true;

  @IsBoolean()
  @IsOptional()
  isStatutory?: boolean = false;
}

export class StructureComponentItemDto {
  @IsString()
  @IsNotEmpty()
  salaryComponentId: string;

  @IsNumber()
  @IsOptional()
  amount?: number = 0;
}

export class CreateSalaryStructureDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsString()
  @IsNotEmpty()
  code: string;

  @IsString()
  @IsOptional()
  description?: string;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => StructureComponentItemDto)
  components: StructureComponentItemDto[];
}

export class AssignSalaryStructureDto {
  @IsString()
  @IsNotEmpty()
  employeeId: string;

  @IsString()
  @IsNotEmpty()
  salaryStructureId: string;

  @IsString()
  @IsNotEmpty()
  effectiveFrom: string;

  @IsString()
  @IsOptional()
  effectiveTo?: string;

  @IsNumber()
  baseSalary: number;
}

export class CreatePayrollPeriodDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsEnum(PayrollFrequency)
  @IsOptional()
  frequency?: PayrollFrequency = PayrollFrequency.MONTHLY;

  @IsString()
  @IsNotEmpty()
  startDate: string;

  @IsString()
  @IsNotEmpty()
  endDate: string;

  @IsString()
  @IsNotEmpty()
  payDate: string;
}

export class ProcessPayrollRunDto {
  @IsString()
  @IsNotEmpty()
  periodId: string;
}

export class UpdatePayrollRunStatusDto {
  @IsEnum(PayrollRunStatus)
  status: PayrollRunStatus;
}
