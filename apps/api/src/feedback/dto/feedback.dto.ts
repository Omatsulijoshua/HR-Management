import { IsString, IsNotEmpty, IsEnum, IsOptional } from 'class-validator';
import { FeedbackStatus } from '@prisma/client';

export class CreateAnonymousFeedbackDto {
  @IsString()
  @IsOptional()
  category?: string;

  @IsString()
  @IsNotEmpty()
  message: string;
}

export class UpdateFeedbackStatusDto {
  @IsEnum(FeedbackStatus)
  @IsNotEmpty()
  status: FeedbackStatus;

  @IsString()
  @IsOptional()
  responseNote?: string;
}
