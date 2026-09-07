import { Controller, Get, Post, Patch, Body, Param, UseGuards, Request } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { CareerService } from './career.service';
import { CreateCareerPathDto, UpdateCareerPathDto } from './dto/career.dto';

@Controller('career')
@UseGuards(JwtAuthGuard)
export class CareerController {
  constructor(private readonly careerService: CareerService) {}

  @Post('paths')
  async createCareerPath(@Request() req: any, @Body() dto: CreateCareerPathDto) {
    const tenantId = req.user.organizationId;
    return this.careerService.createCareerPath(tenantId, dto);
  }

  @Get('paths')
  async findAll(@Request() req: any) {
    const tenantId = req.user.organizationId;
    return this.careerService.findAll(tenantId);
  }

  @Get('paths/:id')
  async findOne(@Request() req: any, @Param('id') id: string) {
    const tenantId = req.user.organizationId;
    return this.careerService.findOne(tenantId, id);
  }

  @Patch('paths/:id')
  async update(@Request() req: any, @Param('id') id: string, @Body() dto: UpdateCareerPathDto) {
    const tenantId = req.user.organizationId;
    return this.careerService.update(tenantId, id, dto);
  }
}
