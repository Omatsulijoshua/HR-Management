import { IsString, IsNotEmpty, IsEnum, IsNumber, IsOptional } from 'class-validator';
import { ProficiencyLevel } from '@prisma/client';

export class CreateSkillDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsString()
  @IsNotEmpty()
  code: string;

  @IsString()
  @IsOptional()
  category?: string = 'General';

  @IsString()
  @IsOptional()
  description?: string;
}

export class RateEmployeeSkillDto {
  @IsString()
  @IsNotEmpty()
  employeeId: string;

  @IsString()
  @IsNotEmpty()
  skillId: string;

  @IsEnum(ProficiencyLevel)
  proficiencyLevel: ProficiencyLevel;

  @IsNumber()
  ratingScore: number;
}

export class CreateSkillRequirementDto {
  @IsString()
  @IsNotEmpty()
  jobPositionId: string;

  @IsString()
  @IsNotEmpty()
  skillId: string;

  @IsEnum(ProficiencyLevel)
  @IsOptional()
  requiredProficiency?: ProficiencyLevel = ProficiencyLevel.ADVANCED;

  @IsNumber()
  @IsOptional()
  requiredScore?: number = 4.0;
}
