import {
  IsString,
  IsNotEmpty,
  IsOptional,
  IsEnum,
  IsNumber,
  IsArray,
  Min,
  IsEmail,
} from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { JobStatus, ApplicationStage, OfferStatus } from '@prisma/client';

export class CreateJobPostingDto {
  @ApiProperty({ example: 'Senior React Developer' })
  @IsString()
  @IsNotEmpty()
  title: string;

  @ApiProperty({ example: 'JOB-DEV-01' })
  @IsString()
  @IsNotEmpty()
  code: string;

  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  departmentId?: string;

  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  locationId?: string;

  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  employmentTypeId?: string;

  @ApiPropertyOptional({ example: 800000 })
  @IsNumber()
  @IsOptional()
  minSalary?: number;

  @ApiPropertyOptional({ example: 1500000 })
  @IsNumber()
  @IsOptional()
  maxSalary?: number;

  @ApiProperty({ example: 'Looking for experienced frontend developer...' })
  @IsString()
  @IsNotEmpty()
  description: string;

  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  requirements?: string;

  @ApiPropertyOptional({ enum: JobStatus, default: JobStatus.PUBLISHED })
  @IsEnum(JobStatus)
  @IsOptional()
  status?: JobStatus;
}

export class CreateCandidateDto {
  @ApiProperty({ example: 'Michael' })
  @IsString()
  @IsNotEmpty()
  firstName: string;

  @ApiProperty({ example: 'Brown' })
  @IsString()
  @IsNotEmpty()
  lastName: string;

  @ApiProperty({ example: 'michael.brown@gmail.com' })
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @ApiPropertyOptional({ example: '+234 803 111 2222' })
  @IsString()
  @IsOptional()
  phone?: string;

  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  resumeUrl?: string;

  @ApiPropertyOptional({ example: ['React', 'TypeScript', 'Node.js'] })
  @IsArray()
  @IsOptional()
  skills?: string[];

  @ApiPropertyOptional({ example: 'LinkedIn' })
  @IsString()
  @IsOptional()
  source?: string;
}

export class ApplyJobDto {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  jobPostingId: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  candidateId: string;

  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  notes?: string;
}

export class UpdateStageDto {
  @ApiProperty({ enum: ApplicationStage })
  @IsEnum(ApplicationStage)
  @IsNotEmpty()
  stage: ApplicationStage;

  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  notes?: string;
}

export class ScheduleInterviewDto {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  jobApplicationId: string;

  @ApiProperty({ example: 'Technical Interview Round 1' })
  @IsString()
  @IsNotEmpty()
  title: string;

  @ApiProperty({ example: '2026-09-15T14:00:00.000Z' })
  @IsString()
  @IsNotEmpty()
  scheduledAt: string;

  @ApiPropertyOptional({ example: 'Google Meet / Room A' })
  @IsString()
  @IsOptional()
  location?: string;

  @ApiPropertyOptional({ example: 'Tech Lead / HR Manager' })
  @IsString()
  @IsOptional()
  interviewerName?: string;
}

export class CreateJobOfferDto {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  jobApplicationId: string;

  @ApiProperty({ example: 1200000 })
  @IsNumber()
  @Min(0)
  offeredSalary: number;

  @ApiProperty({ example: '2026-10-01' })
  @IsString()
  @IsNotEmpty()
  startDate: string;

  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  offerLetterUrl?: string;
}

export class ConvertCandidateDto {
  @ApiProperty({ example: 'EMP-050' })
  @IsString()
  @IsNotEmpty()
  employeeCode: string;

  @ApiProperty({ example: '2026-10-01' })
  @IsString()
  @IsNotEmpty()
  hireDate: string;

  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  departmentId?: string;

  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  positionId?: string;

  @ApiPropertyOptional({ example: 1200000 })
  @IsNumber()
  @IsOptional()
  basicSalary?: number;
}
