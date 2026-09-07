import { IsString, IsNotEmpty, IsEnum, IsOptional, IsNumber } from 'class-validator';
import { AssetCategory, AssetCondition, AssetStatus, AssetRequestStatus } from '@prisma/client';

export class CreateAssetDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsString()
  @IsNotEmpty()
  assetTag: string;

  @IsString()
  @IsOptional()
  serialNumber?: string;

  @IsEnum(AssetCategory)
  @IsOptional()
  category?: AssetCategory;

  @IsEnum(AssetCondition)
  @IsOptional()
  condition?: AssetCondition;

  @IsNumber()
  @IsOptional()
  purchaseCost?: number;
}

export class AssignAssetDto {
  @IsString()
  @IsNotEmpty()
  assetId: string;

  @IsString()
  @IsNotEmpty()
  employeeId: string;
}

export class CreateAssetRequestDto {
  @IsEnum(AssetCategory)
  @IsNotEmpty()
  category: AssetCategory;

  @IsString()
  @IsNotEmpty()
  reason: string;
}

export class UpdateAssetRequestStatusDto {
  @IsEnum(AssetRequestStatus)
  @IsNotEmpty()
  status: AssetRequestStatus;

  @IsString()
  @IsOptional()
  fulfilledAssetId?: string;
}
