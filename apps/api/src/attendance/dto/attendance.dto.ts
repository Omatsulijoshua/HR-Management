import { IsString, IsNotEmpty, IsOptional, IsNumber, IsEnum } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class ClockInDto {
  @ApiPropertyOptional()
  @IsNumber()
  @IsOptional()
  latitude?: number;

  @ApiPropertyOptional()
  @IsNumber()
  @IsOptional()
  longitude?: number;

  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  notes?: string;
}

export class ClockOutDto {
  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  notes?: string;
}

export class RequestCorrectionDto {
  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  attendanceRecordId?: string;

  @ApiProperty({ example: '2026-09-07T08:00:00.000Z' })
  @IsString()
  @IsNotEmpty()
  requestedClockIn: string;

  @ApiProperty({ example: '2026-09-07T17:00:00.000Z' })
  @IsString()
  @IsNotEmpty()
  requestedClockOut: string;

  @ApiProperty({ example: 'Forgot to clock out due to system outage' })
  @IsString()
  @IsNotEmpty()
  reason: string;
}

export class ReviewCorrectionDto {
  @ApiProperty({ example: 'APPROVED' })
  @IsString()
  @IsNotEmpty()
  status: 'APPROVED' | 'REJECTED';

  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  reviewNotes?: string;
}

export class QueryAttendanceDto {
  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  employeeId?: string;

  @ApiPropertyOptional({ example: '2026-09-01' })
  @IsString()
  @IsOptional()
  startDate?: string;

  @ApiPropertyOptional({ example: '2026-09-30' })
  @IsString()
  @IsOptional()
  endDate?: string;
}
