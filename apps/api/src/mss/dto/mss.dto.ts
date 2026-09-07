import { IsString, IsNotEmpty, IsDateString, IsOptional } from 'class-validator';

export class CreateDelegationDto {
  @IsString()
  @IsNotEmpty()
  delegateId: string;

  @IsDateString()
  @IsNotEmpty()
  startDate: string;

  @IsDateString()
  @IsNotEmpty()
  endDate: string;

  @IsString()
  @IsOptional()
  reason?: string;
}

export class ScheduleOneOnOneDto {
  @IsString()
  @IsNotEmpty()
  employeeId: string;

  @IsString()
  @IsNotEmpty()
  title: string;

  @IsDateString()
  @IsNotEmpty()
  scheduledAt: string;

  @IsString()
  @IsOptional()
  agenda?: string;
}
