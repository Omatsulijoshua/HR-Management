import {
  IsString,
  IsNotEmpty,
  IsOptional,
  IsBoolean,
  IsNumber,
  IsArray,
  IsEmail,
  Min,
} from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class UpdateOrganizationDto {
  @ApiPropertyOptional({ example: 'Acme Corporation' })
  @IsString()
  @IsOptional()
  name?: string;

  @ApiPropertyOptional({ example: 'Software & Technology' })
  @IsString()
  @IsOptional()
  industry?: string;

  @ApiPropertyOptional({ example: 'Nigeria' })
  @IsString()
  @IsOptional()
  country?: string;

  @ApiPropertyOptional({ example: 'NGN' })
  @IsString()
  @IsOptional()
  currency?: string;

  @ApiPropertyOptional({ example: 'Africa/Lagos' })
  @IsString()
  @IsOptional()
  timezone?: string;

  @ApiPropertyOptional({ example: '123 Commercial Avenue, Victoria Island' })
  @IsString()
  @IsOptional()
  address?: string;

  @ApiPropertyOptional({ example: 'Lagos' })
  @IsString()
  @IsOptional()
  city?: string;

  @ApiPropertyOptional({ example: 'Lagos' })
  @IsString()
  @IsOptional()
  state?: string;

  @ApiPropertyOptional({ example: '+234 800 000 0000' })
  @IsString()
  @IsOptional()
  phone?: string;

  @ApiPropertyOptional({ example: 'info@acme.com' })
  @IsEmail()
  @IsOptional()
  email?: string;
}

export class CreateBranchDto {
  @ApiProperty({ example: 'Lagos Island HQ' })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty({ example: 'BR-LOS-01' })
  @IsString()
  @IsNotEmpty()
  code: string;

  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  address?: string;

  @ApiPropertyOptional({ example: 'Lagos' })
  @IsString()
  @IsOptional()
  city?: string;

  @ApiPropertyOptional({ example: 'Lagos' })
  @IsString()
  @IsOptional()
  state?: string;

  @ApiPropertyOptional({ example: 'Nigeria' })
  @IsString()
  @IsOptional()
  country?: string;

  @ApiPropertyOptional()
  @IsBoolean()
  @IsOptional()
  isHeadquarters?: boolean;
}

export class CreateDepartmentDto {
  @ApiProperty({ example: 'Engineering & Product' })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty({ example: 'DEP-ENG' })
  @IsString()
  @IsNotEmpty()
  code: string;

  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  description?: string;

  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  parentDepartmentId?: string;
}

export class CreateTeamDto {
  @ApiProperty({ example: 'Engineering' })
  @IsString()
  @IsNotEmpty()
  departmentId: string;

  @ApiProperty({ example: 'Frontend Core Team' })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  description?: string;
}

export class CreateLocationDto {
  @ApiProperty({ example: 'Victoria Island Campus' })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty({ example: 'LOC-VI-01' })
  @IsString()
  @IsNotEmpty()
  code: string;

  @ApiProperty({ example: 'Plot 14, Adeola Odeku' })
  @IsString()
  @IsNotEmpty()
  address: string;

  @ApiProperty({ example: 'Lagos' })
  @IsString()
  @IsNotEmpty()
  city: string;

  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  state?: string;

  @ApiPropertyOptional()
  @IsNumber()
  @IsOptional()
  latitude?: number;

  @ApiPropertyOptional()
  @IsNumber()
  @IsOptional()
  longitude?: number;

  @ApiPropertyOptional({ example: 100 })
  @IsNumber()
  @IsOptional()
  radiusMeters?: number;
}

export class CreateJobGradeDto {
  @ApiProperty({ example: 'Senior Level 1' })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty({ example: 'L5' })
  @IsString()
  @IsNotEmpty()
  code: string;

  @ApiProperty({ example: 5 })
  @IsNumber()
  @Min(1)
  level: number;

  @ApiPropertyOptional({ example: 800000 })
  @IsNumber()
  @IsOptional()
  minSalary?: number;

  @ApiPropertyOptional({ example: 1500000 })
  @IsNumber()
  @IsOptional()
  maxSalary?: number;
}

export class CreateJobPositionDto {
  @ApiProperty({ example: 'Senior Software Engineer' })
  @IsString()
  @IsNotEmpty()
  title: string;

  @ApiProperty({ example: 'POS-SWE-SR' })
  @IsString()
  @IsNotEmpty()
  code: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  departmentId: string;

  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  jobGradeId?: string;

  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  description?: string;
}

export class CreateEmploymentTypeDto {
  @ApiProperty({ example: 'Full-time Permanent' })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty({ example: 'EMP-FT' })
  @IsString()
  @IsNotEmpty()
  code: string;

  @ApiPropertyOptional()
  @IsBoolean()
  @IsOptional()
  isContract?: boolean;
}

export class CreateWorkScheduleDto {
  @ApiProperty({ example: 'Standard Business Hours' })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty({ example: ['MONDAY', 'TUESDAY', 'WEDNESDAY', 'THURSDAY', 'FRIDAY'] })
  @IsArray()
  workDays: string[];

  @ApiPropertyOptional({ example: '08:00' })
  @IsString()
  @IsOptional()
  startTime?: string;

  @ApiPropertyOptional({ example: '17:00' })
  @IsString()
  @IsOptional()
  endTime?: string;

  @ApiPropertyOptional({ example: 60 })
  @IsNumber()
  @IsOptional()
  breakDurationMinutes?: number;
}

export class CreateHolidayDto {
  @ApiProperty({ example: 'Independence Day' })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty({ example: '2026-10-01' })
  @IsString()
  @IsNotEmpty()
  date: string;

  @ApiPropertyOptional()
  @IsBoolean()
  @IsOptional()
  isRecurring?: boolean;
}
