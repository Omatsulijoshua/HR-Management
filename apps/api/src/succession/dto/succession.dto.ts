import { IsString, IsNotEmpty, IsEnum, IsOptional } from 'class-validator';
import { RiskOfLoss, ImpactOfLoss, ReadinessLevel } from '@prisma/client';

export class CreateSuccessionPlanDto {
  @IsString()
  @IsNotEmpty()
  jobPositionId: string;

  @IsEnum(RiskOfLoss)
  @IsOptional()
  riskOfLoss?: RiskOfLoss;

  @IsEnum(ImpactOfLoss)
  @IsOptional()
  impactOfLoss?: ImpactOfLoss;

  @IsString()
  @IsOptional()
  notes?: string;
}

export class AddSuccessionCandidateDto {
  @IsString()
  @IsNotEmpty()
  successionPlanId: string;

  @IsString()
  @IsNotEmpty()
  candidateId: string;

  @IsEnum(ReadinessLevel)
  @IsOptional()
  readinessLevel?: ReadinessLevel;

  @IsString()
  @IsOptional()
  notes?: string;
}
