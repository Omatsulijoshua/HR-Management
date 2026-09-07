import {
  Controller,
  Get,
  Post,
  Patch,
  Body,
  Param,
  Query,
  UseGuards,
  Req,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { Request } from 'express';
import { AttendanceService } from './attendance.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { TenantGuard } from '../organizations/guards/tenant.guard';
import { GetUser } from '../auth/decorators/get-user.decorator';
import {
  ClockInDto,
  ClockOutDto,
  RequestCorrectionDto,
  ReviewCorrectionDto,
  QueryAttendanceDto,
} from './dto/attendance.dto';

@ApiTags('Attendance')
@Controller('attendance')
@UseGuards(JwtAuthGuard, TenantGuard)
@ApiBearerAuth()
export class AttendanceController {
  constructor(private readonly attendanceService: AttendanceService) {}

  @Post('clock-in')
  @ApiOperation({ summary: 'Clock in for current working day' })
  async clockIn(
    @GetUser('organizationId') orgId: string,
    @GetUser('id') userId: string,
    @Body() dto: ClockInDto,
    @Req() req: Request,
  ) {
    const ipAddress = req.ip || req.socket.remoteAddress;
    const userAgent = req.headers['user-agent'];
    return this.attendanceService.clockIn(orgId, userId, dto, ipAddress, userAgent);
  }

  @Post('clock-out')
  @ApiOperation({ summary: 'Clock out and calculate working duration' })
  async clockOut(
    @GetUser('organizationId') orgId: string,
    @GetUser('id') userId: string,
    @Body() dto: ClockOutDto,
  ) {
    return this.attendanceService.clockOut(orgId, userId, dto);
  }

  @Get('records')
  @ApiOperation({ summary: 'List attendance records with filters' })
  async getRecords(
    @GetUser('organizationId') orgId: string,
    @Query() query: QueryAttendanceDto,
  ) {
    return this.attendanceService.getRecords(orgId, query);
  }

  @Post('corrections')
  @ApiOperation({ summary: 'Request attendance correction for missed clocking' })
  async requestCorrection(
    @GetUser('organizationId') orgId: string,
    @GetUser('id') userId: string,
    @Body() dto: RequestCorrectionDto,
  ) {
    return this.attendanceService.requestCorrection(orgId, userId, dto);
  }

  @Get('corrections')
  @ApiOperation({ summary: 'List pending attendance corrections' })
  async getCorrections(@GetUser('organizationId') orgId: string) {
    return this.attendanceService.getCorrections(orgId);
  }

  @Patch('corrections/:id')
  @ApiOperation({ summary: 'Approve or reject attendance correction' })
  async reviewCorrection(
    @GetUser('organizationId') orgId: string,
    @GetUser('id') reviewerUserId: string,
    @Param('id') correctionId: string,
    @Body() dto: ReviewCorrectionDto,
  ) {
    return this.attendanceService.reviewCorrection(orgId, correctionId, reviewerUserId, dto);
  }
}
