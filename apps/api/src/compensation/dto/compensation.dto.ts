import { IsString, IsNotEmpty, IsNumber, IsOptional, IsEnum } from 'class-validator';
import { CompensationReviewStatus } from '@prisma/client';

export class CreateCompensationReviewDto {
  @IsString()
  @IsNotEmpty()
  employeeId: string;

  @IsString()
  @IsNotEmpty()
  reviewTitle: string;

  @IsNumber()
  currentSalary: number;

  @IsNumber()
  proposedSalary: number;

  @IsString()
  @IsOptional()
  reason?: string;

  @IsString()
  @IsNotEmpty()
  effectiveDate: string;
}

export class UpdateCompensationReviewStatusDto {
  @IsEnum(CompensationReviewStatus)
  status: CompensationReviewStatus;
}

export class AllocateBonusDto {
  @IsString()
  @IsNotEmpty()
  employeeId: string;

  @IsString()
  @IsNotEmpty()
  bonusTitle: string;

  @IsNumber()
  amount: number;

  @IsString()
  @IsOptional()
  reason?: string;
}
