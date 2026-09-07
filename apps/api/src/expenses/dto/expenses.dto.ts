import { IsString, IsNotEmpty, IsEnum, IsOptional, IsNumber } from 'class-validator';
import { ExpenseCategory, ExpenseStatus } from '@prisma/client';

export class CreateExpenseClaimDto {
  @IsString()
  @IsNotEmpty()
  title: string;

  @IsEnum(ExpenseCategory)
  @IsOptional()
  category?: ExpenseCategory;

  @IsNumber()
  @IsNotEmpty()
  amount: number;

  @IsString()
  @IsOptional()
  currency?: string;

  @IsString()
  @IsOptional()
  receiptUrl?: string;

  @IsString()
  @IsOptional()
  description?: string;
}

export class UpdateExpenseStatusDto {
  @IsEnum(ExpenseStatus)
  @IsNotEmpty()
  status: ExpenseStatus;

  @IsString()
  @IsOptional()
  managerNotes?: string;

  @IsString()
  @IsOptional()
  financeNotes?: string;
}
