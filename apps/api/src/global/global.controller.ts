import {
  Controller,
  Get,
  Post,
  Body,
  Headers,
  Query,
} from '@nestjs/common';
import { GlobalService } from './global.service';
import {
  CreateCurrencyDto,
  CreateExchangeRateDto,
  CreateTaxConfigDto,
  CreateWorkPermitDto,
} from './dto/global.dto';

@Controller('global')
export class GlobalController {
  constructor(private readonly globalService: GlobalService) {}

  // Currencies
  @Post('currencies')
  async createCurrency(
    @Body() dto: CreateCurrencyDto,
    @Headers('x-organization-id') orgIdHeader?: string,
  ) {
    const orgId = orgIdHeader || 'org-1';
    return this.globalService.createCurrency(orgId, dto);
  }

  @Get('currencies')
  async getCurrencies(@Headers('x-organization-id') orgIdHeader?: string) {
    const orgId = orgIdHeader || 'org-1';
    return this.globalService.getCurrencies(orgId);
  }

  // Exchange Rates & Conversion
  @Post('exchange-rates')
  async setExchangeRate(
    @Body() dto: CreateExchangeRateDto,
    @Headers('x-organization-id') orgIdHeader?: string,
  ) {
    const orgId = orgIdHeader || 'org-1';
    return this.globalService.setExchangeRate(orgId, dto);
  }

  @Get('exchange-rates')
  async getExchangeRates(@Headers('x-organization-id') orgIdHeader?: string) {
    const orgId = orgIdHeader || 'org-1';
    return this.globalService.getExchangeRates(orgId);
  }

  @Get('convert')
  async convertAmount(
    @Query('amount') amount: string,
    @Query('from') fromCurrency: string,
    @Query('to') toCurrency: string,
    @Headers('x-organization-id') orgIdHeader?: string,
  ) {
    const orgId = orgIdHeader || 'org-1';
    return this.globalService.convertAmount(
      orgId,
      parseFloat(amount || '0'),
      fromCurrency || 'USD',
      toCurrency || 'USD',
    );
  }

  // Tax Configurations
  @Post('tax-configs')
  async upsertTaxConfig(
    @Body() dto: CreateTaxConfigDto,
    @Headers('x-organization-id') orgIdHeader?: string,
  ) {
    const orgId = orgIdHeader || 'org-1';
    return this.globalService.upsertTaxConfig(orgId, dto);
  }

  @Get('tax-configs')
  async getTaxConfigs(@Headers('x-organization-id') orgIdHeader?: string) {
    const orgId = orgIdHeader || 'org-1';
    return this.globalService.getTaxConfigs(orgId);
  }

  // Work Permits
  @Post('work-permits')
  async createWorkPermit(
    @Body() dto: CreateWorkPermitDto,
    @Headers('x-organization-id') orgIdHeader?: string,
  ) {
    const orgId = orgIdHeader || 'org-1';
    return this.globalService.createWorkPermit(orgId, dto);
  }

  @Get('work-permits')
  async getWorkPermits(@Headers('x-organization-id') orgIdHeader?: string) {
    const orgId = orgIdHeader || 'org-1';
    return this.globalService.getWorkPermits(orgId);
  }
}
