import { IsString, IsNotEmpty, IsEnum, IsNumber, IsOptional, IsArray, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';
import { GoalCategory, GoalStatus, ReviewCycleStatus, EvaluationStatus } from '@prisma/client';

export class KeyResultItemDto {
  @IsString()
  @IsNotEmpty()
  title: string;

  @IsNumber()
  @IsOptional()
  initialValue?: number = 0;

  @IsNumber()
  targetValue: number;

  @IsString()
  @IsOptional()
  unit?: string = '%';
}

export class CreateGoalDto {
  @IsString()
  @IsOptional()
  employeeId?: string;

  @IsString()
  @IsNotEmpty()
  title: string;

  @IsString()
  @IsOptional()
  description?: string;

  @IsEnum(GoalCategory)
  @IsOptional()
  category?: GoalCategory = GoalCategory.INDIVIDUAL;

  @IsString()
  @IsNotEmpty()
  startDate: string;

  @IsString()
  @IsNotEmpty()
  targetDate: string;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => KeyResultItemDto)
  keyResults: KeyResultItemDto[];
}

export class UpdateKeyResultProgressDto {
  @IsNumber()
  currentValue: number;
}

export class CreateReviewCycleDto {
  @IsString()
  @IsNotEmpty()
  title: string;

  @IsString()
  @IsNotEmpty()
  startDate: string;

  @IsString()
  @IsNotEmpty()
  endDate: string;
}

export class SubmitSelfEvaluationDto {
  @IsNumber()
  selfRating: number;

  @IsString()
  @IsOptional()
  selfFeedback?: string;
}

export class SubmitManagerEvaluationDto {
  @IsNumber()
  managerRating: number;

  @IsString()
  @IsOptional()
  managerFeedback?: string;
}

export class Submit360FeedbackDto {
  @IsString()
  @IsNotEmpty()
  performanceReviewId: string;

  @IsString()
  @IsNotEmpty()
  peerName: string;

  @IsString()
  @IsOptional()
  peerRole?: string;

  @IsNumber()
  rating: number;

  @IsString()
  @IsOptional()
  comments?: string;
}
