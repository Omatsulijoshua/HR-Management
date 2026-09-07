import { IsString, IsNotEmpty, IsEnum, IsNumber, IsOptional } from 'class-validator';
import { CourseType, TrainingEnrollmentStatus } from '@prisma/client';

export class CreateTrainingCourseDto {
  @IsString()
  @IsNotEmpty()
  title: string;

  @IsString()
  @IsNotEmpty()
  code: string;

  @IsEnum(CourseType)
  @IsOptional()
  type?: CourseType = CourseType.INTERNAL_WORKSHOP;

  @IsString()
  @IsOptional()
  instructor?: string;

  @IsString()
  @IsOptional()
  description?: string;

  @IsNumber()
  @IsOptional()
  durationHours?: number = 8;

  @IsNumber()
  @IsOptional()
  capacity?: number = 30;
}

export class EnrollTrainingDto {
  @IsString()
  @IsNotEmpty()
  courseId: string;

  @IsString()
  @IsNotEmpty()
  employeeId: string;
}

export class UpdateEnrollmentStatusDto {
  @IsEnum(TrainingEnrollmentStatus)
  status: TrainingEnrollmentStatus;

  @IsString()
  @IsOptional()
  certificateUrl?: string;
}
