import { IsString, IsNotEmpty, IsEnum, IsNumber, IsOptional, IsBoolean, IsArray, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';
import { BenefitType, EnrollmentStatus } from '@prisma/client';

export class CreateBenefitOptionDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsString()
  @IsNotEmpty()
  coverageTier: string;

  @IsNumber()
  @IsOptional()
  employeeContribution?: number = 0;

  @IsNumber()
  @IsOptional()
  employerContribution?: number = 0;
}

export class CreateBenefitPlanDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsString()
  @IsNotEmpty()
  code: string;

  @IsEnum(BenefitType)
  type: BenefitType;

  @IsString()
  @IsOptional()
  provider?: string;

  @IsString()
  @IsOptional()
  description?: string;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CreateBenefitOptionDto)
  options: CreateBenefitOptionDto[];
}

export class EnrollEmployeeBenefitDto {
  @IsString()
  @IsNotEmpty()
  employeeId: string;

  @IsString()
  @IsNotEmpty()
  benefitPlanId: string;

  @IsString()
  @IsNotEmpty()
  benefitOptionId: string;

  @IsString()
  @IsNotEmpty()
  effectiveFrom: string;

  @IsString()
  @IsOptional()
  effectiveTo?: string;
}

export class UpdateEnrollmentStatusDto {
  @IsEnum(EnrollmentStatus)
  status: EnrollmentStatus;
}
