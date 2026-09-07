import { IsString, IsNotEmpty, IsEnum, IsOptional } from 'class-validator';
import { MobilityRequestStatus } from '@prisma/client';

export class CreateMobilityRequestDto {
  @IsString()
  @IsNotEmpty()
  employeeId: string;

  @IsString()
  @IsNotEmpty()
  targetPositionId: string;

  @IsString()
  @IsNotEmpty()
  reason: string;
}

export class UpdateMobilityStatusDto {
  @IsEnum(MobilityRequestStatus)
  @IsNotEmpty()
  status: MobilityRequestStatus;

  @IsString()
  @IsOptional()
  managerReview?: string;

  @IsString()
  @IsOptional()
  hrReview?: string;
}
