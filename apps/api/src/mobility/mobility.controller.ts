import { Controller, Get, Post, Patch, Body, Param, UseGuards, Request } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { MobilityService } from './mobility.service';
import { CreateMobilityRequestDto, UpdateMobilityStatusDto } from './dto/mobility.dto';

@Controller('mobility')
@UseGuards(JwtAuthGuard)
export class MobilityController {
  constructor(private readonly mobilityService: MobilityService) {}

  @Post('requests')
  async createRequest(@Request() req: any, @Body() dto: CreateMobilityRequestDto) {
    const tenantId = req.user.organizationId;
    return this.mobilityService.createRequest(tenantId, dto);
  }

  @Get('requests')
  async findAllRequests(@Request() req: any) {
    const tenantId = req.user.organizationId;
    return this.mobilityService.findAllRequests(tenantId);
  }

  @Get('requests/:id')
  async findOneRequest(@Request() req: any, @Param('id') id: string) {
    const tenantId = req.user.organizationId;
    return this.mobilityService.findOneRequest(tenantId, id);
  }

  @Patch('requests/:id/status')
  async updateStatus(
    @Request() req: any,
    @Param('id') id: string,
    @Body() dto: UpdateMobilityStatusDto,
  ) {
    const tenantId = req.user.organizationId;
    return this.mobilityService.updateStatus(tenantId, id, dto);
  }
}
