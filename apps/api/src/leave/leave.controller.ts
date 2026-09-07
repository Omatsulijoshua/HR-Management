import {
  Controller,
  Get,
  Post,
  Patch,
  Body,
  Param,
  Query,
  UseGuards,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { LeaveService } from './leave.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { TenantGuard } from '../organizations/guards/tenant.guard';
import { GetUser } from '../auth/decorators/get-user.decorator';
import {
  CreateLeaveTypeDto,
  CreateLeavePolicyDto,
  CreateLeaveRequestDto,
  ReviewLeaveRequestDto,
  QueryLeaveRequestsDto,
} from './dto/leave.dto';

@ApiTags('Leave Management')
@Controller('leave')
@UseGuards(JwtAuthGuard, TenantGuard)
@ApiBearerAuth()
export class LeaveController {
  constructor(private readonly leaveService: LeaveService) {}

  @Get('types')
  @ApiOperation({ summary: 'List leave types' })
  async getLeaveTypes(@GetUser('organizationId') orgId: string) {
    return this.leaveService.getLeaveTypes(orgId);
  }

  @Post('types')
  @ApiOperation({ summary: 'Create new leave type' })
  async createLeaveType(@GetUser('organizationId') orgId: string, @Body() dto: CreateLeaveTypeDto) {
    return this.leaveService.createLeaveType(orgId, dto);
  }

  @Get('policies')
  @ApiOperation({ summary: 'List leave policies' })
  async getLeavePolicies(@GetUser('organizationId') orgId: string) {
    return this.leaveService.getLeavePolicies(orgId);
  }

  @Post('policies')
  @ApiOperation({ summary: 'Create leave policy' })
  async createLeavePolicy(@GetUser('organizationId') orgId: string, @Body() dto: CreateLeavePolicyDto) {
    return this.leaveService.createLeavePolicy(orgId, dto);
  }

  @Get('balances')
  @ApiOperation({ summary: 'Get current user leave entitlement balances' })
  async getEmployeeBalances(
    @GetUser('organizationId') orgId: string,
    @GetUser('id') userId: string,
  ) {
    return this.leaveService.getEmployeeBalances(orgId, userId);
  }

  @Post('requests')
  @ApiOperation({ summary: 'Submit new leave request' })
  async requestLeave(
    @GetUser('organizationId') orgId: string,
    @GetUser('id') userId: string,
    @Body() dto: CreateLeaveRequestDto,
  ) {
    return this.leaveService.requestLeave(orgId, userId, dto);
  }

  @Get('requests')
  @ApiOperation({ summary: 'List leave requests' })
  async getLeaveRequests(
    @GetUser('organizationId') orgId: string,
    @Query() query: QueryLeaveRequestsDto,
  ) {
    return this.leaveService.getLeaveRequests(orgId, query);
  }

  @Patch('requests/:id/review')
  @ApiOperation({ summary: 'Approve or reject leave request' })
  async reviewLeaveRequest(
    @GetUser('organizationId') orgId: string,
    @GetUser('id') reviewerUserId: string,
    @Param('id') requestId: string,
    @Body() dto: ReviewLeaveRequestDto,
  ) {
    return this.leaveService.reviewLeaveRequest(orgId, requestId, reviewerUserId, dto);
  }

  @Get('calendar')
  @ApiOperation({ summary: 'Get approved leave calendar schedule' })
  async getLeaveCalendar(@GetUser('organizationId') orgId: string) {
    return this.leaveService.getLeaveCalendar(orgId);
  }
}
