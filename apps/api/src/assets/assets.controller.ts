import { Controller, Get, Post, Body, UseGuards, Request, ForbiddenException } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { AssetsService } from './assets.service';
import { CreateAssetDto, AssignAssetDto, CreateAssetRequestDto } from './dto/assets.dto';

@Controller('assets')
@UseGuards(JwtAuthGuard)
export class AssetsController {
  constructor(private readonly assetsService: AssetsService) {}

  @Post()
  async createAsset(@Request() req: any, @Body() dto: CreateAssetDto) {
    const tenantId = req.user.organizationId;
    return this.assetsService.createAsset(tenantId, dto);
  }

  @Post('assign')
  async assignAsset(@Request() req: any, @Body() dto: AssignAssetDto) {
    const tenantId = req.user.organizationId;
    return this.assetsService.assignAsset(tenantId, dto);
  }

  @Post('requests')
  async createRequest(@Request() req: any, @Body() dto: CreateAssetRequestDto) {
    const tenantId = req.user.organizationId;
    const employeeId = req.user.employeeId;
    if (!employeeId) {
      throw new ForbiddenException('User is not linked to an employee record');
    }
    return this.assetsService.createRequest(tenantId, employeeId, dto);
  }

  @Get()
  async findAllAssets(@Request() req: any) {
    const tenantId = req.user.organizationId;
    return this.assetsService.findAllAssets(tenantId);
  }

  @Get('requests')
  async findAllRequests(@Request() req: any) {
    const tenantId = req.user.organizationId;
    return this.assetsService.findAllRequests(tenantId);
  }
}
