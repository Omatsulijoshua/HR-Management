import { Controller, Get, Post, Body, Headers, UseGuards } from '@nestjs/common';
import { AnalyticsService } from './analytics.service';
import { GenerateReportDto } from './dto/analytics.dto';

@Controller('analytics')
export class AnalyticsController {
  constructor(private readonly analyticsService: AnalyticsService) {}

  @Get('overview')
  async getExecutiveOverview(@Headers('x-organization-id') orgIdHeader?: string) {
    const orgId = orgIdHeader || 'org-1';
    return this.analyticsService.getExecutiveOverview(orgId);
  }

  @Post('reports/generate')
  async generateReport(
    @Body() dto: GenerateReportDto,
    @Headers('x-organization-id') orgIdHeader?: string,
  ) {
    const orgId = orgIdHeader || 'org-1';
    return this.analyticsService.generateReport(orgId, dto);
  }
}
