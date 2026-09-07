import { IsString, IsNumber, IsBoolean, IsOptional, IsEnum, IsDateString } from 'class-validator';
import { PermitStatus } from '@prisma/client';

export class CreateCurrencyDto {
  @IsString()
  code: string;

  @IsString()
  symbol: string;

  @IsString()
  name: string;

  @IsOptional()
  @IsBoolean()
  isBaseCurrency?: boolean;
}

export class CreateExchangeRateDto {
  @IsString()
  fromCurrency: string;

  @IsString()
  toCurrency: string;

  @IsNumber()
  rate: number;
}

export class CreateTaxConfigDto {
  @IsString()
  countryCode: string;

  @IsString()
  countryName: string;

  @IsString()
  taxAuthorityName: string;

  @IsNumber()
  defaultTaxRate: number;

  @IsNumber()
  pensionRate: number;
}

export class CreateWorkPermitDto {
  @IsString()
  employeeId: string;

  @IsString()
  permitType: string;

  @IsString()
  permitNumber: string;

  @IsString()
  issuingCountry: string;

  @IsDateString()
  expiryDate: string;

  @IsOptional()
  @IsEnum(PermitStatus)
  status?: PermitStatus;
}
