import { IsString, IsNotEmpty, IsEnum, IsOptional, IsBoolean } from 'class-validator';
import { PolicyCategory, IncidentSeverity, IncidentStatus } from '@prisma/client';

export class CreatePolicyDto {
  @IsString()
  @IsNotEmpty()
  title: string;

  @IsString()
  @IsNotEmpty()
  code: string;

  @IsEnum(PolicyCategory)
  @IsOptional()
  category?: PolicyCategory;

  @IsString()
  @IsOptional()
  documentUrl?: string;

  @IsString()
  @IsOptional()
  version?: string;

  @IsBoolean()
  @IsOptional()
  isMandatory?: boolean;
}

export class AcknowledgePolicyDto {
  @IsString()
  @IsNotEmpty()
  policyId: string;

  @IsString()
  @IsOptional()
  signatureUrl?: string;
}

export class ReportIncidentDto {
  @IsString()
  @IsNotEmpty()
  title: string;

  @IsString()
  @IsOptional()
  location?: string;

  @IsEnum(IncidentSeverity)
  @IsOptional()
  severity?: IncidentSeverity;

  @IsString()
  @IsNotEmpty()
  description: string;
}

export class UpdateIncidentStatusDto {
  @IsEnum(IncidentStatus)
  @IsNotEmpty()
  status: IncidentStatus;
}
