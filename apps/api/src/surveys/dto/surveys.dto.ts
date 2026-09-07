import { IsString, IsNotEmpty, IsEnum, IsOptional, IsArray, IsObject, IsNumber } from 'class-validator';
import { SurveyType, SurveyStatus, QuestionType } from '@prisma/client';

export class CreateSurveyDto {
  @IsString()
  @IsNotEmpty()
  title: string;

  @IsString()
  @IsNotEmpty()
  code: string;

  @IsString()
  @IsOptional()
  description?: string;

  @IsEnum(SurveyType)
  @IsOptional()
  type?: SurveyType;

  @IsString()
  @IsOptional()
  targetDepartmentId?: string;
}

export class AddQuestionDto {
  @IsString()
  @IsNotEmpty()
  surveyId: string;

  @IsString()
  @IsNotEmpty()
  questionText: string;

  @IsEnum(QuestionType)
  @IsOptional()
  type?: QuestionType;

  @IsObject()
  @IsOptional()
  options?: any;
}

export class SubmitSurveyResponseDto {
  @IsString()
  @IsNotEmpty()
  surveyId: string;

  @IsObject()
  @IsNotEmpty()
  answers: any;

  @IsNumber()
  @IsOptional()
  score?: number;
}
