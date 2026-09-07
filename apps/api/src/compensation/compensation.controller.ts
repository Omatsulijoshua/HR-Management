import { Controller, Get, Post, Patch, Body, Param, UseGuards, Req } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { TenantGuard } from '../organizations/guards/tenant.guard';
import { CompensationService } from './compensation.service';
import {
  CreateCompensationReviewDto,
  UpdateCompensationReviewStatusDto,
  AllocateBonusDto,
} from './dto/compensation.dto';

@ApiTags('Compensation')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, TenantGuard)
@Controller('compensation')
export class CompensationController {
  constructor(private readonly compensationService: CompensationService) {}

  @Post('reviews')
  @ApiOperation({ summary: 'Initiate a salary compensation review' })
  async createCompensationReview(@Req() req: any, @Body() dto: CreateCompensationReviewDto) {
    return this.compensationService.createCompensationReview(req.user.organizationId, dto);
  }

  @Get('reviews')
  @ApiOperation({ summary: 'Get all compensation reviews' })
  async getCompensationReviews(@Req() req: any) {
    return this.compensationService.getCompensationReviews(req.user.organizationId);
  }

  @Patch('reviews/:id/status')
  @ApiOperation({ summary: 'Approve or reject salary review' })
  async updateCompensationReviewStatus(@Req() req: any, @Param('id') id: string, @Body() dto: UpdateCompensationReviewStatusDto) {
    return this.compensationService.updateCompensationReviewStatus(req.user.organizationId, id, dto);
  }

  @Post('bonuses')
  @ApiOperation({ summary: 'Allocate a performance bonus to employee' })
  async allocateBonus(@Req() req: any, @Body() dto: AllocateBonusDto) {
    return this.compensationService.allocateBonus(req.user.organizationId, dto);
  }

  @Get('bonuses')
  @ApiOperation({ summary: 'Get all bonus allocations' })
  async getBonusAllocations(@Req() req: any) {
    return this.compensationService.getBonusAllocations(req.user.organizationId);
  }
}
