import {
  IsString,
  IsNotEmpty,
  IsOptional,
  IsBoolean,
  IsArray,
  IsNumber,
  Min,
} from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { TaskStatus } from '@prisma/client';

export class CreateOnboardingTaskDto {
  @ApiProperty({ example: 'Submit Bank Verification Number (BVN)' })
  @IsString()
  @IsNotEmpty()
  title: string;

  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  description?: string;

  @ApiPropertyOptional({ default: true })
  @IsBoolean()
  @IsOptional()
  isRequired?: boolean;

  @ApiPropertyOptional({ example: 7 })
  @IsNumber()
  @IsOptional()
  dueDays?: number;
}

export class CreateOnboardingTemplateDto {
  @ApiProperty({ example: 'Standard Engineering New Hire Checklist' })
  @IsString()
  @IsNotEmpty()
  title: string;

  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  description?: string;

  @ApiPropertyOptional({ type: [CreateOnboardingTaskDto] })
  @IsArray()
  @IsOptional()
  tasks?: CreateOnboardingTaskDto[];
}

export class AssignOnboardingDto {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  employeeId: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  templateId: string;
}

export class UpdateTaskStatusDto {
  @ApiProperty({ enum: TaskStatus })
  @IsString()
  @IsNotEmpty()
  status: TaskStatus;
}
