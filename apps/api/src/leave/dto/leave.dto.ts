import {
  IsString,
  IsNotEmpty,
  IsOptional,
  IsBoolean,
  IsNumber,
  IsEnum,
  Min,
} from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { LeaveRequestStatus } from '@prisma/client';

export class CreateLeaveTypeDto {
  @ApiProperty({ example: 'Annual Leave' })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty({ example: 'ANNUAL' })
  @IsString()
  @IsNotEmpty()
  code: string;

  @ApiPropertyOptional({ example: 20 })
  @IsNumber()
  @Min(1)
  @IsOptional()
  defaultDays?: number;

  @ApiPropertyOptional({ default: true })
  @IsBoolean()
  @IsOptional()
  isPaid?: boolean;

  @ApiPropertyOptional({ example: '#3B82F6' })
  @IsString()
  @IsOptional()
  colorCode?: string;
}

export class CreateLeavePolicyDto {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  leaveTypeId: string;

  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  employmentTypeId?: string;

  @ApiProperty({ example: 20 })
  @IsNumber()
  maxDaysPerYear: number;

  @ApiPropertyOptional({ example: 5 })
  @IsNumber()
  @IsOptional()
  carryOverDays?: number;

  @ApiPropertyOptional({ example: 3 })
  @IsNumber()
  @IsOptional()
  noticeDaysRequired?: number;
}

export class CreateLeaveRequestDto {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  leaveTypeId: string;

  @ApiProperty({ example: '2026-10-01' })
  @IsString()
  @IsNotEmpty()
  startDate: string;

  @ApiProperty({ example: '2026-10-10' })
  @IsString()
  @IsNotEmpty()
  endDate: string;

  @ApiProperty({ example: 7 })
  @IsNumber()
  @Min(0.5)
  totalDays: number;

  @ApiProperty({ example: 'Annual vacation leave request' })
  @IsString()
  @IsNotEmpty()
  reason: string;
}

export class ReviewLeaveRequestDto {
  @ApiProperty({ enum: ['APPROVED', 'REJECTED'] })
  @IsString()
  @IsNotEmpty()
  status: 'APPROVED' | 'REJECTED';

  @ApiPropertyOptional({ example: 'Approved by HR manager' })
  @IsString()
  @IsOptional()
  reviewNotes?: string;
}

export class QueryLeaveRequestsDto {
  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  employeeId?: string;

  @ApiPropertyOptional({ enum: LeaveRequestStatus })
  @IsEnum(LeaveRequestStatus)
  @IsOptional()
  status?: LeaveRequestStatus;
}
